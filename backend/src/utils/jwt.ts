import jwt from "jsonwebtoken";
import type { UserRole } from "../types";

interface TokenPayload {
  id: string;
  role: UserRole;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return jwt.sign(payload, secret, {
    expiresIn: process.env["JWT_EXPIRES_IN"] ?? "7d",
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return jwt.verify(token, secret) as TokenPayload;
};
