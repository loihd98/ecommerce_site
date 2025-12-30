import { Router } from "express";
import { body, param } from "express-validator";
import {
  getAffiliateLinks,
  getAffiliateLink,
  createAffiliateLink,
  updateAffiliateLink,
  deleteAffiliateLink,
} from "../controllers/affiliateLink.controller.js";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

const router = Router();

// Public routes
router.get("/", getAffiliateLinks);
router.get("/:id", getAffiliateLink);

// Admin routes
router.post(
  "/",
  authenticate,
  isAdmin,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("url").trim().notEmpty().withMessage("URL is required"),
    validate,
  ],
  createAffiliateLink
);

router.put(
  "/:id",
  authenticate,
  isAdmin,
  [param("id").notEmpty().withMessage("ID is required"), validate],
  updateAffiliateLink
);

router.delete(
  "/:id",
  authenticate,
  isAdmin,
  [param("id").notEmpty().withMessage("ID is required"), validate],
  deleteAffiliateLink
);

export default router;
