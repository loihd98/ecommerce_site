import multer from 'multer';
import path from 'path';
import { config } from '../config/config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.mimetype.startsWith('video/') 
      ? config.upload.videoDestination 
      : config.upload.imageDestination;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ...config.upload.allowedImageTypes,
    ...config.upload.allowedVideoTypes,
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

// Image filter
const imageFilter = (req, file, cb) => {
  if (config.upload.allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

// Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

// Image upload only
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

// Get file URL
export const getFileUrl = (req, filename, type = 'image') => {
  const baseUrl = req.protocol + '://' + req.get('host');
  const folder = type === 'video' ? 'videos' : 'images';
  return `${baseUrl}/uploads/${folder}/${filename}`;
};
