import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
} from '../controllers/order.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { paymentRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getOrders);

router.get(
  '/:id',
  [
    param('id').notEmpty().withMessage('Order ID is required'),
    validate,
  ],
  getOrder
);

router.post(
  '/',
  paymentRateLimiter,
  [
    body('addressId').notEmpty().withMessage('Address ID is required'),
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.productId').notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validate,
  ],
  createOrder
);

router.put(
  '/:id/cancel',
  [
    param('id').notEmpty().withMessage('Order ID is required'),
    validate,
  ],
  cancelOrder
);

export default router;
