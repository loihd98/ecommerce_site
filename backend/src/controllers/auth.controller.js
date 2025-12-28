import prisma from '../config/database.js';
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
} from '../utils/auth.js';
import { ApiResponse, AuthenticationError, ConflictError, NotFoundError } from '../utils/response.js';
import { sendEmail, emailTemplates } from '../utils/email.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Register new user
export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }
  
  // Hash password
  const passwordHash = await hashPassword(password);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
  
  // Send welcome email
  const welcomeEmail = emailTemplates.welcome(user.name);
  await sendEmail({
    to: user.email,
    ...welcomeEmail,
  });
  
  // Generate tokens
  const accessToken = generateAccessToken({ userId: user.id });
  const refreshToken = generateRefreshToken({ userId: user.id });
  
  res.status(201).json(
    ApiResponse.created({
      user,
      accessToken,
      refreshToken,
    }, 'Registration successful')
  );
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user || !user.passwordHash) {
    throw new AuthenticationError('Invalid email or password');
  }
  
  // Verify password
  const isValid = await verifyPassword(password, user.passwordHash);
  
  if (!isValid) {
    throw new AuthenticationError('Invalid email or password');
  }
  
  // Generate tokens
  const accessToken = generateAccessToken({ userId: user.id });
  const refreshToken = generateRefreshToken({ userId: user.id });
  
  // Return user data without password
  const { passwordHash, ...userData } = user;
  
  res.json(
    ApiResponse.success({
      user: userData,
      accessToken,
      refreshToken,
    }, 'Login successful')
  );
});

// Refresh token
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    throw new AuthenticationError('Refresh token required');
  }
  
  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);
  
  if (!decoded) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }
  
  // Generate new tokens
  const newAccessToken = generateAccessToken({ userId: decoded.userId });
  const newRefreshToken = generateRefreshToken({ userId: decoded.userId });
  
  res.json(
    ApiResponse.success({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }, 'Token refreshed')
  );
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  // In a production app, you might want to blacklist the token
  res.json(
    ApiResponse.success(null, 'Logout successful')
  );
});

// Forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    // Don't reveal if user exists
    res.json(
      ApiResponse.success(null, 'If email exists, password reset link has been sent')
    );
    return;
  }
  
  // Generate reset token
  const resetToken = generateResetToken();
  
  // Save token to database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour
    },
  });
  
  // Send email
  const resetLink = `${req.headers.origin}/reset-password?token=${resetToken}`;
  const resetEmail = emailTemplates.passwordReset(user.name, resetLink);
  
  await sendEmail({
    to: user.email,
    ...resetEmail,
  });
  
  res.json(
    ApiResponse.success(null, 'Password reset link sent to email')
  );
});

// Reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  
  // Find user with valid token
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });
  
  if (!user) {
    throw new AuthenticationError('Invalid or expired reset token');
  }
  
  // Hash new password
  const passwordHash = await hashPassword(newPassword);
  
  // Update password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
  
  res.json(
    ApiResponse.success(null, 'Password reset successful')
  );
});

// Get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      phone: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  res.json(
    ApiResponse.success(user)
  );
});
