import prisma from '../config/database.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Get wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await prisma.wishlist.findMany({
    where: { userId: req.user.id },
    include: {
      product: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  res.json(ApiResponse.success(wishlist));
});

// Add to wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  
  if (!product || !product.isActive) {
    return res.status(404).json(
      ApiResponse.notFound('Product not found')
    );
  }
  
  // Check if already in wishlist
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: req.user.id,
        productId,
      },
    },
  });
  
  if (existing) {
    return res.status(400).json(
      ApiResponse.badRequest('Product already in wishlist')
    );
  }
  
  const wishlistItem = await prisma.wishlist.create({
    data: {
      userId: req.user.id,
      productId,
    },
    include: {
      product: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });
  
  res.status(201).json(
    ApiResponse.created(wishlistItem, 'Added to wishlist')
  );
});

// Remove from wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  const wishlistItem = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: req.user.id,
        productId,
      },
    },
  });
  
  if (!wishlistItem) {
    return res.status(404).json(
      ApiResponse.notFound('Item not in wishlist')
    );
  }
  
  await prisma.wishlist.delete({
    where: { id: wishlistItem.id },
  });
  
  res.json(
    ApiResponse.success(null, 'Removed from wishlist')
  );
});

// Clear wishlist
export const clearWishlist = asyncHandler(async (req, res) => {
  await prisma.wishlist.deleteMany({
    where: { userId: req.user.id },
  });
  
  res.json(
    ApiResponse.success(null, 'Wishlist cleared')
  );
});
