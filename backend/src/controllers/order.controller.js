import prisma from "../config/database.js";
import { ApiResponse, NotFoundError } from "../utils/response.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { generateOrderNumber } from "../utils/helpers.js";
import { sendEmail, emailTemplates } from "../utils/email.js";

// Create order
export const createOrder = asyncHandler(async (req, res) => {
  const { addressId, items, paymentMethod, notes } = req.body;

  // Verify address belongs to user
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId: req.user.id,
    },
  });

  if (!address) {
    throw new NotFoundError("Address not found");
  }

  // Calculate totals and verify stock
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product || !product.isActive) {
      return res
        .status(400)
        .json(ApiResponse.badRequest(`Product ${item.productId} not found`));
    }

    if (product.stock < item.quantity) {
      return res
        .status(400)
        .json(ApiResponse.badRequest(`Insufficient stock for ${product.name}`));
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
      total: itemTotal,
      productName: product.name,
      productImage: product.images[0] || null,
      color: item.color || null,
      size: item.size || null,
      note: item.note || null,
    });
  }

  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  // Create order with items
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: req.user.id,
      addressId,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod: paymentMethod || "COD",
      notes,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      address: true,
    },
  });

  // Update product stock and sold count
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: { decrement: item.quantity },
        soldCount: { increment: item.quantity },
      },
    });
  }

  // Clear cart
  await prisma.cartItem.deleteMany({
    where: {
      userId: req.user.id,
      productId: { in: items.map((i) => i.productId) },
    },
  });

  // Send confirmation email
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const confirmationEmail = emailTemplates.orderConfirmation(
    user.name,
    order.orderNumber,
    order.total,
    orderItems
  );

  await sendEmail({
    to: user.email,
    ...confirmationEmail,
  });

  res
    .status(201)
    .json(ApiResponse.created(order, "Order created successfully"));
});

// Get user orders
export const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const where = {
    userId: req.user.id,
    ...(status && { status }),
  };

  const totalCount = await prisma.order.count({ where });

  const currentPage = Math.max(1, parseInt(page));
  const pageSize = Math.min(parseInt(limit), 50);
  const skip = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(totalCount / pageSize);

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      },
      address: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
  });

  res.json(
    ApiResponse.success({
      orders,
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

// Get order by ID
export const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      address: true,
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  res.json(ApiResponse.success(order));
});

// Cancel order
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (order.status !== "PENDING") {
    return res
      .status(400)
      .json(ApiResponse.badRequest("Only pending orders can be cancelled"));
  }

  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  // Restore product stock
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: { increment: item.quantity },
        soldCount: { decrement: item.quantity },
      },
    });
  }

  res.json(ApiResponse.success(updatedOrder, "Order cancelled successfully"));
});
