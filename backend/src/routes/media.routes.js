import { Router } from 'express';
import { param } from 'express-validator';
import {
  uploadMedia,
  getAllMedia,
  deleteMedia,
} from '../controllers/media.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

// Upload requires admin authentication
router.post(
  '/upload',
  authenticate,
  isAdmin,
  uploadImage.single('file'),
  uploadMedia
);

// Get all media (admin only)
router.get('/', authenticate, isAdmin, getAllMedia);

// Delete media (admin only)
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  [
    param('id').notEmpty().withMessage('Media ID is required'),
    validate,
  ],
  deleteMedia
);

export default router;
