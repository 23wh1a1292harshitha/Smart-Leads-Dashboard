import type { Response } from "express";
import type { ApiResponse, PaginationMeta } from "../types";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  meta?: PaginationMeta
): void => {
  const response: ApiResponse<T> = { success: true, message, data, meta };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: unknown
): void => {
  const response: ApiResponse<null> = { success: false, message, errors };
  res.status(statusCode).json(response);
};
