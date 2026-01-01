import { Router } from 'express';
import { param } from 'express-validator';
import {
  getCategories,
  getCategory,
  getCategoryProducts,
} from '../controllers/category.controller.js';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

router.get('/', getCategories);

router.get(
  '/:id',
  [
    param('id').notEmpty().withMessage('Category ID or slug is required'),
    validate,
  ],
  getCategory
);

router.get(
  '/:id/products',
  [
    param('id').notEmpty().withMessage('Category ID or slug is required'),
    validate,
  ],
  getCategoryProducts
);

export default router;
