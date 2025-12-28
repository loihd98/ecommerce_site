import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', getUserProfile);

router.put(
  '/profile',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
    validate,
  ],
  updateUserProfile
);

router.post(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
    validate,
  ],
  changePassword
);

// Address routes
router.get('/addresses', getUserAddresses);

router.post(
  '/addresses',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    validate,
  ],
  addAddress
);

router.put(
  '/addresses/:id',
  [
    param('id').isString().withMessage('Valid address ID required'),
    validate,
  ],
  updateAddress
);

router.delete(
  '/addresses/:id',
  [
    param('id').isString().withMessage('Valid address ID required'),
    validate,
  ],
  deleteAddress
);

export default router;
