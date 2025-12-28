import slugify from 'slugify';

// Generate unique slug
export const generateSlug = (text, suffix = '') => {
  const baseSlug = slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
  
  return suffix ? `${baseSlug}-${suffix}` : baseSlug;
};

// Generate order number
export const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Calculate pagination
export const calculatePagination = (page, pageSize, totalCount) => {
  const currentPage = Math.max(1, parseInt(page) || 1);
  const limit = Math.min(parseInt(pageSize) || 20, 100);
  const skip = (currentPage - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    page: currentPage,
    pageSize: limit,
    skip,
    totalCount,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

// Format price
export const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Calculate average rating
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

// Sanitize object (remove undefined/null values)
export const sanitizeObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
  );
};

// Parse sort parameter
export const parseSortParam = (sortParam) => {
  if (!sortParam) return {};
  
  const sorts = sortParam.split(',');
  const orderBy = {};
  
  sorts.forEach(sort => {
    const [field, order] = sort.split(':');
    if (field) {
      orderBy[field] = order === 'desc' ? 'desc' : 'asc';
    }
  });
  
  return orderBy;
};

// Parse filter parameters
export const parseFilterParams = (filters) => {
  const where = {};
  
  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }
  
  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = parseFloat(filters.minPrice);
    if (filters.maxPrice) where.price.lte = parseFloat(filters.maxPrice);
  }
  
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  
  if (filters.isFeatured !== undefined) {
    where.isFeatured = filters.isFeatured === 'true';
  }
  
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === 'true';
  }
  
  return where;
};
