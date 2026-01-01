import express from "express";
const router = express.Router();
import * as commentController from "../controllers/comment.controller.js";
import {
  authenticate,
  optionalAuthenticate,
} from "../middleware/auth.middleware.js";

// Public routes
router.get(
  "/products/:productId/comments",
  commentController.getProductComments
);

// Protected routes (authenticated users or guests)
router.post(
  "/products/:productId/comments",
  optionalAuthenticate,
  commentController.createComment
);

// Protected routes (authenticated users only)
router.put(
  "/comments/:commentId",
  authenticate,
  commentController.updateComment
);
router.delete(
  "/comments/:commentId",
  authenticate,
  commentController.deleteComment
);

export default router;
