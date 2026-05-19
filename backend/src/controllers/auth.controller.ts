import type { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { sendSuccess, sendError } from "../utils/response";
import type { AuthRequest } from "../types";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body as {
    name?: string; email?: string; password?: string; role?: string;
  };

  if (!name || name.trim().length < 2) {
    sendError(res, "Name must be at least 2 characters", 400); return;
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    sendError(res, "Please enter a valid email", 400); return;
  }
  if (!password || password.length < 6) {
    sendError(res, "Password must be at least 6 characters", 400); return;
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    sendError(res, "User with this email already exists", 409); return;
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    role: role ?? "sales",
  });

  const token = generateToken({ id: user.id as string, role: user.role });

  sendSuccess(res, "User registered successfully", {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  }, 201);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    sendError(res, "Email and password are required", 400); return;
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    sendError(res, "Invalid email or password", 401); return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    sendError(res, "Invalid email or password", 401); return;
  }

  const token = generateToken({ id: user.id as string, role: user.role });

  sendSuccess(res, "Login successful", {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;
  const user = await User.findById(authReq.user?.id);
  if (!user) { sendError(res, "User not found", 404); return; }
  sendSuccess(res, "User fetched", {
    id: user.id, name: user.name, email: user.email, role: user.role,
  });
};
