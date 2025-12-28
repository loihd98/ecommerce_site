import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getDashboardStats,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
} from '../controllers/admin.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

// All routes require admin authentication
router.use(authenticate, isAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Products
router.post(
  '/products',
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
    body('categoryId').notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Valid stock required'),
    validate,
  ],
  createProduct
);

router.put(
  '/products/:id',
  [
    param('id').notEmpty().withMessage('Product ID is required'),
    validate,
  ],
  updateProduct
);

router.delete(
  '/products/:id',
  [
    param('id').notEmpty().withMessage('Product ID is required'),
    validate,
  ],
  deleteProduct
);

// Categories
router.post(
  '/categories',
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    validate,
  ],
  createCategory
);

router.put(
  '/categories/:id',
  [
    param('id').notEmpty().withMessage('Category ID is required'),
    validate,
  ],
  updateCategory
);

router.delete(
  '/categories/:id',
  [
    param('id').notEmpty().withMessage('Category ID is required'),
    validate,
  ],
  deleteCategory
);

// Orders
router.get('/orders', getAllOrders);

router.put(
  '/orders/:id',
  [
    param('id').notEmpty().withMessage('Order ID is required'),
    body('status').optional().isIn(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
    validate,
  ],
  updateOrderStatus
);

// Users
router.get('/users', getAllUsers);

router.put(
  '/users/:id/role',
  [
    param('id').notEmpty().withMessage('User ID is required'),
    body('role').isIn(['USER', 'ADMIN']).withMessage('Invalid role'),
    validate,
  ],
  updateUserRole
);

export default router;
