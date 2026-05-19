import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

// Express v5 error handler - must have exactly 4 params
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const message = err instanceof Error ? err.message : "Internal server error";
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message });
};

export const notFound = (_req: Request, res: Response): void => {
  sendError(res, "Route not found", 404);
};
