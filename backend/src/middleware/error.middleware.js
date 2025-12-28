import { ApiResponse, AppError } from '../utils/response.js';
import { Prisma } from '@prisma/client';

// Global error handler
export const errorHandler = (err, req, res, next) => {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });
  
  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }
  
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json(
      ApiResponse.badRequest('Invalid data provided')
    );
  }
  
  // Operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, err.errors, err.statusCode)
    );
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      ApiResponse.unauthorized('Invalid token')
    );
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      ApiResponse.unauthorized('Token expired')
    );
  }
  
  // Multer errors
  if (err.name === 'MulterError') {
    return handleMulterError(err, res);
  }
  
  // Default error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(statusCode).json(
    ApiResponse.error(message, null, statusCode)
  );
};

// Handle Prisma errors
const handlePrismaError = (err, res) => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = err.meta?.target?.[0] || 'field';
      return res.status(409).json(
        ApiResponse.conflict(`${field} already exists`)
      );
      
    case 'P2025':
      // Record not found
      return res.status(404).json(
        ApiResponse.notFound('Record not found')
      );
      
    case 'P2003':
      // Foreign key constraint violation
      return res.status(400).json(
        ApiResponse.badRequest('Invalid reference')
      );
      
    default:
      return res.status(500).json(
        ApiResponse.error('Database error')
      );
  }
};

// Handle Multer errors
const handleMulterError = (err, res) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json(
      ApiResponse.badRequest('File too large')
    );
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json(
      ApiResponse.badRequest('Too many files')
    );
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json(
      ApiResponse.badRequest('Unexpected file field')
    );
  }
  
  return res.status(400).json(
    ApiResponse.badRequest('File upload error')
  );
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json(
    ApiResponse.notFound(`Route ${req.originalUrl} not found`)
  );
};

// Async handler wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
