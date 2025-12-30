import prisma from '../config/database.js';
import { ApiResponse, NotFoundError } from '../utils/response.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Get all categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      children: true,
      _count: {
        select: {
          products: {
            where: { isActive: true },
          },
        },
      },
    },
    where: {
      parentId: null,
    },
    orderBy: { name: 'asc' },
  });
  
  res.json(ApiResponse.success(categories));
});

// Get category by ID or slug
export const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const category = await prisma.category.findFirst({
    where: {
      OR: [
        { id },
        { slug: id },
      ],
    },
    include: {
      children: true,
      parent: true,
      _count: {
        select: {
          products: {
            where: { isActive: true },
          },
        },
      },
    },
  });
  
  if (!category) {
    throw new NotFoundError('Category not found');
  }
  
  res.json(ApiResponse.success(category));
});

// Get products in category
export const getCategoryProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 20, sort = 'createdAt:desc' } = req.query;
  
  const category = await prisma.category.findFirst({
    where: {
      OR: [
        { id },
        { slug: id },
      ],
    },
  });
  
  if (!category) {
    throw new NotFoundError('Category not found');
  }
  
  // Get total count
  const totalCount = await prisma.product.count({
    where: {
      categoryId: category.id,
      isActive: true,
    },
  });
  
  const currentPage = Math.max(1, parseInt(page));
  const pageSize = Math.min(parseInt(limit), 100);
  const skip = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
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
    orderBy: { createdAt: sort === 'createdAt:asc' ? 'asc' : 'desc' },
    skip,
    take: pageSize,
  });
  
  res.json(
    ApiResponse.success({
      category,
      products,
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
