import { Router, type Request, type Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { sendSuccess, sendError } from "../utils/response";
import { authenticate } from "../middleware/auth";
import { register, login, getMe } from "../controllers/auth.controller";

const router = Router();

router.post("/register", (req: Request, res: Response) => {
  void (async () => {
    try {
      await register(req, res);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server error";
      if (!res.headersSent) res.status(500).json({ success: false, message });
    }
  })();
});

router.post("/login", (req: Request, res: Response) => {
  void (async () => {
    try {
      await login(req, res);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server error";
      if (!res.headersSent) res.status(500).json({ success: false, message });
    }
  })();
});

router.get("/me", authenticate, (req: Request, res: Response) => {
  void (async () => {
    try {
      await getMe(req, res);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server error";
      if (!res.headersSent) res.status(500).json({ success: false, message });
    }
  })();
});

export default router;
