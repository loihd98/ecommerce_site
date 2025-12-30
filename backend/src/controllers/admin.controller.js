import prisma from "../config/database.js";
import { ApiResponse, NotFoundError } from "../utils/response.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { generateSlug, calculatePagination } from "../utils/helpers.js";
import { uploadImage, getFileUrl } from "../middleware/upload.middleware.js";

// Dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalRevenue, totalProducts, totalUsers, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  res.json(
    ApiResponse.success({
      stats: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalProducts,
        totalUsers,
      },
      recentOrders,
    })
  );
});

// Product Management
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    shortDesc,
    price,
    comparePrice,
    cost,
    sku,
    barcode,
    categoryId,
    stock,
    lowStockThreshold,
    isActive,
    isFeatured,
    metaTitle,
    metaDescription,
    metaKeywords,
    images,
  } = req.body;

  const slug = generateSlug(name);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      shortDesc,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      cost: cost ? parseFloat(cost) : null,
      sku,
      barcode,
      categoryId,
      stock: parseInt(stock) || 0,
      lowStockThreshold: parseInt(lowStockThreshold) || 5,
      isActive: isActive !== false,
      isFeatured: isFeatured === true,
      metaTitle,
      metaDescription,
      metaKeywords,
      images: images || [],
    },
    include: {
      category: true,
    },
  });

  res
    .status(201)
    .json(ApiResponse.created(product, "Product created successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  // Generate new slug if name changed
  if (data.name && data.name !== product.name) {
    data.slug = generateSlug(data.name);
  }

  // Parse numeric fields
  if (data.price) data.price = parseFloat(data.price);
  if (data.comparePrice) data.comparePrice = parseFloat(data.comparePrice);
  if (data.cost) data.cost = parseFloat(data.cost);
  if (data.stock) data.stock = parseInt(data.stock);
  if (data.lowStockThreshold)
    data.lowStockThreshold = parseInt(data.lowStockThreshold);

  const updatedProduct = await prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });

  res.json(ApiResponse.success(updatedProduct, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.product.delete({
    where: { id },
  });

  res.json(ApiResponse.success(null, "Product deleted successfully"));
});

// Category Management
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image, parentId } = req.body;

  const slug = generateSlug(name);

  // Validate parentId: convert empty string to null, validate if provided
  let validParentId = null;
  if (parentId && parentId !== '' && parentId !== 'null') {
    // Check if parent category exists
    const parentCategory = await prisma.category.findUnique({
      where: { id: parentId },
    });
    if (!parentCategory) {
      throw new NotFoundError("Parent category not found");
    }
    validParentId = parentId;
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      image,
      parentId: validParentId,
    },
  });

  res
    .status(201)
    .json(ApiResponse.created(category, "Category created successfully"));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, image, parentId } = req.body;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  // Validate parentId: convert empty string to null, validate if provided
  let validParentId = undefined;
  if (parentId !== undefined) {
    if (parentId === '' || parentId === 'null' || parentId === null) {
      validParentId = null;
    } else {
      // Check if parent category exists and prevent circular reference
      if (parentId === id) {
        throw new Error("Category cannot be its own parent");
      }
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parentCategory) {
        throw new NotFoundError("Parent category not found");
      }
      validParentId = parentId;
    }
  }

  const data = {
    ...(name && { name, slug: generateSlug(name) }),
    ...(description !== undefined && { description }),
    ...(image !== undefined && { image }),
    ...(validParentId !== undefined && { parentId: validParentId }),
  };

  const updatedCategory = await prisma.category.update({
    where: { id },
    data,
  });

  res.json(
    ApiResponse.success(updatedCategory, "Category updated successfully")
  );
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if category has products
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    return res
      .status(400)
      .json(ApiResponse.badRequest("Cannot delete category with products"));
  }

  await prisma.category.delete({
    where: { id },
  });

  res.json(ApiResponse.success(null, "Category deleted successfully"));
});

// Order Management
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const where = status ? { status } : {};
  const totalCount = await prisma.order.count({ where });
  const pagination = calculatePagination(page, limit, totalCount);

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
      address: true,
    },
    orderBy: { createdAt: "desc" },
    skip: pagination.skip,
    take: pagination.pageSize,
  });

  res.json(
    ApiResponse.success({
      orders,
      pagination,
    })
  );
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, trackingNumber } = req.body;

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(trackingNumber && { trackingNumber }),
    },
    include: {
      user: true,
      items: true,
    },
  });

  // Send shipped email if status changed to SHIPPED
  if (status === "SHIPPED") {
    const { sendEmail, emailTemplates } = await import("../utils/email.js");
    const shippedEmail = emailTemplates.orderShipped(
      order.user.name,
      order.orderNumber,
      trackingNumber
    );

    await sendEmail({
      to: order.user.email,
      ...shippedEmail,
    });
  }

  res.json(ApiResponse.success(order, "Order updated successfully"));
});

// User Management
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role } = req.query;

  const where = role ? { role } : {};
  const totalCount = await prisma.user.count({ where });
  const pagination = calculatePagination(page, limit, totalCount);

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      phone: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: pagination.skip,
    take: pagination.pageSize,
  });

  res.json(
    ApiResponse.success({
      users,
      pagination,
    })
  );
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  res.json(ApiResponse.success(user, "User role updated successfully"));
});
