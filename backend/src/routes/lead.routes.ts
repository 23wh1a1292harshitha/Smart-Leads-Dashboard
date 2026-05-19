import { Router } from "express";
import { getLeads, getLeadById, createLead, updateLead, deleteLead, exportLeadsCSV } from "../controllers/lead.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getLeads);
router.get("/export/csv", exportLeadsCSV);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", authorize("admin"), deleteLead);

export default router;
