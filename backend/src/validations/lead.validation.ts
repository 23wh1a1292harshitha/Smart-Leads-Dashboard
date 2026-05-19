import { body } from "express-validator";

export const createLeadValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
  body("status").optional().isIn(["New", "Contacted", "Qualified", "Lost"]).withMessage("Invalid status"),
  body("source").notEmpty().withMessage("Source is required").isIn(["Website", "Instagram", "Referral"]).withMessage("Invalid source"),
  body("notes").optional().trim().isLength({ max: 500 }).withMessage("Notes cannot exceed 500 characters"),
];

export const updateLeadValidation = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").optional().trim().isEmail().withMessage("Please enter a valid email").normalizeEmail(),
  body("status").optional().isIn(["New", "Contacted", "Qualified", "Lost"]).withMessage("Invalid status"),
  body("source").optional().isIn(["Website", "Instagram", "Referral"]).withMessage("Invalid source"),
  body("notes").optional().trim().isLength({ max: 500 }).withMessage("Notes cannot exceed 500 characters"),
];
