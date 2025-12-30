import { verifyAccessToken } from '../utils/auth.js';
import { ApiResponse, AuthenticationError } from '../utils/response.js';
import prisma from '../config/database.js';

// Authenticate user middleware
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      throw new AuthenticationError('Invalid or expired token');
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
      },
    });
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(error.statusCode).json(
        ApiResponse.unauthorized(error.message)
      );
    }
    return res.status(500).json(
      ApiResponse.error('Authentication failed')
    );
  }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      
      if (decoded) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true,
          },
        });
        
        if (user) {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Authorize roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.unauthorized('Authentication required')
      );
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        ApiResponse.forbidden('Insufficient permissions')
      );
    }
    
    next();
  };
};

// Check if user is admin
export const isAdmin = authorize('ADMIN');

// Check if user owns resource or is admin
export const isOwnerOrAdmin = (resourceUserIdGetter) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json(
          ApiResponse.unauthorized('Authentication required')
        );
      }
      
      // Admin can access everything
      if (req.user.role === 'ADMIN') {
        return next();
      }
      
      // Get resource owner ID
      const resourceUserId = await resourceUserIdGetter(req);
      
      if (req.user.id !== resourceUserId) {
        return res.status(403).json(
          ApiResponse.forbidden('Access denied')
        );
      }
      
      next();
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error('Authorization check failed')
      );
    }
  };
};
