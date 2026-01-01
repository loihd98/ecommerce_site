import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlist.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getWishlist);

router.post(
  '/',
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    validate,
  ],
  addToWishlist
);

router.delete(
  '/:productId',
  [
    param('productId').notEmpty().withMessage('Product ID is required'),
    validate,
  ],
  removeFromWishlist
);

router.delete('/', clearWishlist);

export default router;
