import mongoose, { Schema, type Document } from "mongoose";
import type { LeadStatus, LeadSource } from "../types";

export interface ILeadDocument extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], lowercase: true, trim: true },
    status: { type: String, enum: ["New", "Contacted", "Qualified", "Lost"], default: "New" },
    source: { type: String, enum: ["Website", "Instagram", "Referral"], required: [true, "Source is required"] },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

LeadSchema.index({ name: "text", email: "text" });

export default mongoose.model<ILeadDocument>("Lead", LeadSchema);
