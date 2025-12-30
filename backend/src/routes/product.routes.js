import { Router } from 'express';
import { query, param } from 'express-validator';
import {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getRelatedProducts,
} from '../controllers/product.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { optionalAuthenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getProducts);

router.get('/featured', getFeaturedProducts);

router.get(
  '/:id',
  [
    param('id').notEmpty().withMessage('Product ID or slug is required'),
    validate,
  ],
  optionalAuthenticate,
  getProduct
);

router.get(
  '/:id/related',
  [
    param('id').notEmpty().withMessage('Product ID is required'),
    validate,
  ],
  getRelatedProducts
);

export default router;
