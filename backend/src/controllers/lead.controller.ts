import type { Response } from "express";
import Lead from "../models/Lead";
import { sendSuccess, sendError } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import type { AuthRequest, LeadQuery, LeadStatus, LeadSource } from "../types";
import mongoose from "mongoose";

export const getLeads = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, source, search, sort = "latest", page = 1, limit = 10 } = req.query as unknown as LeadQuery;

  const filter: mongoose.FilterQuery<typeof Lead> = {};
  if (status) filter["status"] = status;
  if (source) filter["source"] = source;
  if (search) {
    filter["$or"] = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const sortOrder = sort === "oldest" ? 1 : -1;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limitNum).populate("createdBy", "name email"),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);
  sendSuccess(res, "Leads fetched successfully", leads, 200, {
    total, page: pageNum, limit: limitNum, totalPages,
    hasNextPage: pageNum < totalPages, hasPrevPage: pageNum > 1,
  });
});

export const getLeadById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params["id"]).populate("createdBy", "name email");
  if (!lead) { sendError(res, "Lead not found", 404); return; }
  sendSuccess(res, "Lead fetched successfully", lead);
});

export const createLead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, status, source, notes } = req.body as {
    name?: string; email?: string; status?: LeadStatus; source?: LeadSource; notes?: string;
  };

  if (!name || name.trim().length < 2) { sendError(res, "Name must be at least 2 characters", 400); return; }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) { sendError(res, "Please enter a valid email", 400); return; }
  if (!source || !["Website", "Instagram", "Referral"].includes(source)) { sendError(res, "Valid source is required", 400); return; }

  const lead = await Lead.create({
    name: name.trim(), email: email.toLowerCase(),
    status: status ?? "New", source, notes, createdBy: req.user?.id,
  });
  sendSuccess(res, "Lead created successfully", lead, 201);
});

export const updateLead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params["id"]);
  if (!lead) { sendError(res, "Lead not found", 404); return; }

  if (req.user?.role === "sales" && lead.createdBy.toString() !== req.user.id) {
    sendError(res, "Access denied.", 403); return;
  }

  const updated = await Lead.findByIdAndUpdate(
    req.params["id"], { $set: req.body as object }, { new: true, runValidators: true }
  );
  sendSuccess(res, "Lead updated successfully", updated);
});

export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params["id"]);
  if (!lead) { sendError(res, "Lead not found", 404); return; }
  if (req.user?.role !== "admin") { sendError(res, "Only admins can delete leads.", 403); return; }
  await Lead.findByIdAndDelete(req.params["id"]);
  sendSuccess(res, "Lead deleted successfully");
});

export const exportLeadsCSV = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, source, search } = req.query as { status?: LeadStatus; source?: LeadSource; search?: string };
  const filter: mongoose.FilterQuery<typeof Lead> = {};
  if (status) filter["status"] = status;
  if (source) filter["source"] = source;
  if (search) filter["$or"] = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];

  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  const csvHeader = "Name,Email,Status,Source,Notes,Created At\n";
  const csvRows = leads.map((lead) => {
    const l = lead as typeof lead & { createdAt: Date };
    return [`"${l.name}"`, `"${l.email}"`, `"${l.status}"`, `"${l.source}"`, `"${l.notes ?? ""}"`, `"${l.createdAt.toISOString()}"`].join(",");
  }).join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
  res.send(csvHeader + csvRows);
});
