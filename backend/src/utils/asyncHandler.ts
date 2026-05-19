import type { Request, Response, NextFunction } from "express";

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

// Express v5 handles async natively, but this wrapper ensures compatibility
export const asyncHandler = (fn: AsyncFn) => {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ success: false, message });
    });
  };
};
