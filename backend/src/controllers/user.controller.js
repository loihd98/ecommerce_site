import prisma from '../config/database.js';
import { ApiResponse, NotFoundError } from '../utils/response.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { hashPassword } from '../utils/auth.js';

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
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
      addresses: {
        orderBy: { isDefault: 'desc' },
      },
    },
  });
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  res.json(ApiResponse.success(user));
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(avatar && { avatar }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      phone: true,
      role: true,
    },
  });
  
  res.json(ApiResponse.success(user, 'Profile updated successfully'));
});

// Change password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });
  
  if (!user || !user.passwordHash) {
    throw new NotFoundError('User not found');
  }
  
  // Verify current password
  const { verifyPassword } = await import('../utils/auth.js');
  const isValid = await verifyPassword(currentPassword, user.passwordHash);
  
  if (!isValid) {
    return res.status(400).json(
      ApiResponse.badRequest('Current password is incorrect')
    );
  }
  
  // Hash new password
  const passwordHash = await hashPassword(newPassword);
  
  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash },
  });
  
  res.json(ApiResponse.success(null, 'Password changed successfully'));
});

// Get user addresses
export const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user.id },
    orderBy: { isDefault: 'desc' },
  });
  
  res.json(ApiResponse.success(addresses));
});

// Add address
export const addAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, address, city, state, zipCode, country, isDefault } = req.body;
  
  // If this is default, unset other defaults
  if (isDefault) {
    await prisma.address.updateMany({
      where: {
        userId: req.user.id,
        isDefault: true,
      },
      data: { isDefault: false },
    });
  }
  
  const newAddress = await prisma.address.create({
    data: {
      userId: req.user.id,
      fullName,
      phone,
      address,
      city,
      state,
      zipCode,
      country: country || 'Vietnam',
      isDefault: isDefault || false,
    },
  });
  
  res.status(201).json(
    ApiResponse.created(newAddress, 'Address added successfully')
  );
});

// Update address
export const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fullName, phone, address, city, state, zipCode, country, isDefault } = req.body;
  
  // Verify ownership
  const existingAddress = await prisma.address.findUnique({
    where: { id },
  });
  
  if (!existingAddress || existingAddress.userId !== req.user.id) {
    throw new NotFoundError('Address not found');
  }
  
  // If this is default, unset other defaults
  if (isDefault) {
    await prisma.address.updateMany({
      where: {
        userId: req.user.id,
        isDefault: true,
        id: { not: id },
      },
      data: { isDefault: false },
    });
  }
  
  const updatedAddress = await prisma.address.update({
    where: { id },
    data: {
      ...(fullName && { fullName }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(city && { city }),
      ...(state !== undefined && { state }),
      ...(zipCode !== undefined && { zipCode }),
      ...(country && { country }),
      ...(isDefault !== undefined && { isDefault }),
    },
  });
  
  res.json(ApiResponse.success(updatedAddress, 'Address updated successfully'));
});

// Delete address
export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Verify ownership
  const address = await prisma.address.findUnique({
    where: { id },
  });
  
  if (!address || address.userId !== req.user.id) {
    throw new NotFoundError('Address not found');
  }
  
  await prisma.address.delete({
    where: { id },
  });
  
  res.json(ApiResponse.success(null, 'Address deleted successfully'));
});
