import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";

const app = express();
const PORT = process.env["PORT"] ?? 5000;

app.use(cors({
  origin: "*",
  credentials: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Inline test route - no middleware
app.post("/test-register", async (req: Request, res: Response) => {
  try {
    const body = req.body as { name?: string };
    res.json({ success: true, received: body });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal server error";
  console.error("Global error:", message);
  res.status(500).json({ success: false, message });
});

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start().catch(console.error);
