import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from '../controllers/review.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

router.get(
  '/product/:productId',
  [
    param('productId').notEmpty().withMessage('Product ID is required'),
    validate,
  ],
  getProductReviews
);

router.post(
  '/',
  authenticate,
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').optional().trim(),
    body('comment').optional().trim(),
    validate,
  ],
  createReview
);

router.put(
  '/:id',
  authenticate,
  [
    param('id').notEmpty().withMessage('Review ID is required'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    validate,
  ],
  updateReview
);

router.delete(
  '/:id',
  authenticate,
  [
    param('id').notEmpty().withMessage('Review ID is required'),
    validate,
  ],
  deleteReview
);

export default router;
