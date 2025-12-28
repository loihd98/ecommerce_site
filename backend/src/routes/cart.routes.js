import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getCart);

router.post(
  '/',
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validate,
  ],
  addToCart
);

router.put(
  '/:id',
  [
    param('id').notEmpty().withMessage('Cart item ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validate,
  ],
  updateCartItem
);

router.delete(
  '/:id',
  [
    param('id').notEmpty().withMessage('Cart item ID is required'),
    validate,
  ],
  removeCartItem
);

router.delete('/', clearCart);

export default router;
