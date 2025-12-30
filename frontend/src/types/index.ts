// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: "USER" | "ADMIN";
  isEmailVerified: boolean;
  createdAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  affiliateLink?: string;
  adminNote?: string;
  categoryId: string;
  category?: Category;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  _count?: {
    products: number;
  };
}

// Cart types
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  loading: boolean;
}

// Order types
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  total: number;
  productName: string;
  productImage?: string;
  color?: string;
  size?: string;
  note?: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  addressId: string;
  address: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  trackingNumber?: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

// Wishlist types
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

// Pagination types
export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  errors?: any;
  timestamp: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: any;
}

// Filter types
export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}
