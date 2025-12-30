import prisma from '../config/database.js';
import { ApiResponse, NotFoundError } from '../utils/response.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Create review
export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;
  
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  
  // Check if user already reviewed
  const existingReview = await prisma.review.findUnique({
    where: {
      productId_userId: {
        productId,
        userId: req.user.id,
      },
    },
  });
  
  if (existingReview) {
    return res.status(400).json(
      ApiResponse.badRequest('You have already reviewed this product')
    );
  }
  
  // Check if user purchased the product
  const purchase = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId: req.user.id,
        status: 'DELIVERED',
      },
    },
  });
  
  const review = await prisma.review.create({
    data: {
      productId,
      userId: req.user.id,
      rating,
      title,
      comment,
      isVerifiedPurchase: !!purchase,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  
  res.status(201).json(
    ApiResponse.created(review, 'Review created successfully')
  );
});

// Get product reviews
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  const where = { productId };
  const totalCount = await prisma.review.count({ where });
  
  const currentPage = Math.max(1, parseInt(page));
  const pageSize = Math.min(parseInt(limit), 50);
  const skip = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const reviews = await prisma.review.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize,
  });
  
  res.json(
    ApiResponse.success({
      reviews,
      pagination: {
        page: currentPage,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    })
  );
});

// Update review
export const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;
  
  const review = await prisma.review.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });
  
  if (!review) {
    throw new NotFoundError('Review not found');
  }
  
  const updatedReview = await prisma.review.update({
    where: { id },
    data: {
      ...(rating && { rating }),
      ...(title !== undefined && { title }),
      ...(comment !== undefined && { comment }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  
  res.json(
    ApiResponse.success(updatedReview, 'Review updated successfully')
  );
});

// Delete review
export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const review = await prisma.review.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });
  
  if (!review) {
    throw new NotFoundError('Review not found');
  }
  
  await prisma.review.delete({
    where: { id },
  });
  
  res.json(
    ApiResponse.success(null, 'Review deleted successfully')
  );
});
