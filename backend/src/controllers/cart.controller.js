import prisma from '../config/database.js';
import { ApiResponse, NotFoundError } from '../utils/response.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Get user cart
export const getCart = asyncHandler(async (req, res) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          images: true,
          stock: true,
          isActive: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);
  
  res.json(
    ApiResponse.success({
      items: cartItems,
      itemCount: cartItems.length,
      subtotal: parseFloat(subtotal.toFixed(2)),
    })
  );
});

// Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  // Check if product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  
  if (!product || !product.isActive) {
    throw new NotFoundError('Product not found');
  }
  
  // Check stock
  if (product.stock < quantity) {
    return res.status(400).json(
      ApiResponse.badRequest('Insufficient stock')
    );
  }
  
  // Check if item already in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: req.user.id,
        productId,
      },
    },
  });
  
  let cartItem;
  
  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;
    
    if (product.stock < newQuantity) {
      return res.status(400).json(
        ApiResponse.badRequest('Insufficient stock')
      );
    }
    
    cartItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            stock: true,
          },
        },
      },
    });
  } else {
    // Create new cart item
    cartItem = await prisma.cartItem.create({
      data: {
        userId: req.user.id,
        productId,
        quantity,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            stock: true,
          },
        },
      },
    });
  }
  
  res.status(201).json(
    ApiResponse.created(cartItem, 'Item added to cart')
  );
});

// Update cart item
export const updateCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  
  // Check if cart item exists and belongs to user
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
    include: { product: true },
  });
  
  if (!cartItem) {
    throw new NotFoundError('Cart item not found');
  }
  
  // Check stock
  if (cartItem.product.stock < quantity) {
    return res.status(400).json(
      ApiResponse.badRequest('Insufficient stock')
    );
  }
  
  const updatedItem = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          images: true,
          stock: true,
        },
      },
    },
  });
  
  res.json(
    ApiResponse.success(updatedItem, 'Cart item updated')
  );
});

// Remove cart item
export const removeCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if cart item exists and belongs to user
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });
  
  if (!cartItem) {
    throw new NotFoundError('Cart item not found');
  }
  
  await prisma.cartItem.delete({
    where: { id },
  });
  
  res.json(
    ApiResponse.success(null, 'Item removed from cart')
  );
});

// Clear cart
export const clearCart = asyncHandler(async (req, res) => {
  await prisma.cartItem.deleteMany({
    where: { userId: req.user.id },
  });
  
  res.json(
    ApiResponse.success(null, 'Cart cleared')
  );
});
