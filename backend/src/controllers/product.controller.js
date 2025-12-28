import prisma from '../config/database.js';
import { ApiResponse, NotFoundError } from '../utils/response.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { calculatePagination, parseFilterParams, parseSortParam } from '../utils/helpers.js';

// Get all products
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    categoryId,
    minPrice,
    maxPrice,
    search,
    isFeatured,
    sort = 'createdAt:desc',
  } = req.query;
  
  // Build filter
  const where = {
    isActive: true,
    ...parseFilterParams({ categoryId, minPrice, maxPrice, search, isFeatured }),
  };
  
  // Get total count
  const totalCount = await prisma.product.count({ where });
  
  // Calculate pagination
  const pagination = calculatePagination(page, limit, totalCount);
  
  // Get products
  const products = await prisma.product.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: parseSortParam(sort),
    skip: pagination.skip,
    take: pagination.pageSize,
  });
  
  // Calculate average rating for each product
  const productsWithRating = await Promise.all(
    products.map(async (product) => {
      const reviews = await prisma.review.findMany({
        where: { productId: product.id },
        select: { rating: true },
      });
      
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      
      return {
        ...product,
        averageRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length,
      };
    })
  );
  
  res.json(
    ApiResponse.success({
      products: productsWithRating,
      pagination,
    })
  );
});

// Get product by ID or slug
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id },
        { slug: id },
      ],
      isActive: true,
    },
    include: {
      category: true,
      variants: true,
      reviews: {
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
      },
    },
  });
  
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  
  // Increment view count
  await prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  });
  
  // Calculate average rating
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;
  
  res.json(
    ApiResponse.success({
      ...product,
      averageRating: parseFloat(avgRating.toFixed(1)),
      reviewCount: product.reviews.length,
    })
  );
});

// Get featured products
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { soldCount: 'desc' },
    take: parseInt(limit),
  });
  
  res.json(ApiResponse.success(products));
});

// Get related products
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit = 4 } = req.query;
  
  const product = await prisma.product.findUnique({
    where: { id },
    select: { categoryId: true },
  });
  
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: id },
      isActive: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    take: parseInt(limit),
  });
  
  res.json(ApiResponse.success(relatedProducts));
});
