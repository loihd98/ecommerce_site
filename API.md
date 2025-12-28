# 📋 API Documentation

Base URL: `http://localhost:5000/api` (Development)  
Production: `https://yourdomain.com/api`

All endpoints return JSON responses in this format:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### POST /auth/login
Authenticate user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /auth/refresh
Refresh access token.

**Body:**
```json
{
  "refreshToken": "..."
}
```

### POST /auth/forgot-password
Request password reset.

**Body:**
```json
{
  "email": "user@example.com"
}
```

### POST /auth/reset-password
Reset password with token.

**Body:**
```json
{
  "token": "reset_token",
  "newPassword": "newpassword123"
}
```

### GET /auth/me
Get current user. Requires authentication.

---

## Products

### GET /products
Get all products with filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `categoryId` (string): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `search` (string): Search in name and description
- `isFeatured` (boolean): Filter featured products
- `sort` (string): Sort field (e.g., "price:asc", "createdAt:desc")

**Response:**
```json
{
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalCount": 100,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### GET /products/:id
Get product by ID or slug.

### GET /products/featured
Get featured products.

**Query Parameters:**
- `limit` (number): Number of products (default: 10)

### GET /products/:id/related
Get related products.

---

## Categories

### GET /categories
Get all categories.

### GET /categories/:id
Get category by ID or slug.

### GET /categories/:id/products
Get products in category.

---

## Cart

**All cart endpoints require authentication.**

### GET /cart
Get user's cart.

### POST /cart
Add item to cart.

**Body:**
```json
{
  "productId": "...",
  "quantity": 1
}
```

### PUT /cart/:itemId
Update cart item quantity.

**Body:**
```json
{
  "quantity": 2
}
```

### DELETE /cart/:itemId
Remove item from cart.

### DELETE /cart
Clear entire cart.

---

## Orders

**All order endpoints require authentication.**

### GET /orders
Get user's orders.

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `status` (string): Filter by status

### GET /orders/:id
Get order details.

### POST /orders
Create new order.

**Body:**
```json
{
  "addressId": "...",
  "items": [
    {
      "productId": "...",
      "quantity": 1
    }
  ],
  "paymentMethod": "CARD",
  "notes": "Please deliver after 5 PM"
}
```

### PUT /orders/:id/cancel
Cancel pending order.

---

## Reviews

### GET /reviews/product/:productId
Get product reviews.

### POST /reviews
Create review. Requires authentication.

**Body:**
```json
{
  "productId": "...",
  "rating": 5,
  "title": "Great product!",
  "comment": "Highly recommended"
}
```

### PUT /reviews/:id
Update review. Requires authentication.

### DELETE /reviews/:id
Delete review. Requires authentication.

---

## Wishlist

**All wishlist endpoints require authentication.**

### GET /wishlist
Get user's wishlist.

### POST /wishlist
Add product to wishlist.

**Body:**
```json
{
  "productId": "..."
}
```

### DELETE /wishlist/:productId
Remove product from wishlist.

### DELETE /wishlist
Clear wishlist.

---

## Admin Endpoints

**All admin endpoints require authentication with ADMIN role.**

### GET /admin/dashboard
Get dashboard statistics.

### Products Management

#### POST /admin/products
Create product.

#### PUT /admin/products/:id
Update product.

#### DELETE /admin/products/:id
Delete product.

### Categories Management

#### POST /admin/categories
Create category.

#### PUT /admin/categories/:id
Update category.

#### DELETE /admin/categories/:id
Delete category.

### Orders Management

#### GET /admin/orders
Get all orders.

#### PUT /admin/orders/:id
Update order status.

**Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "1234567890"
}
```

### Users Management

#### GET /admin/users
Get all users.

#### PUT /admin/users/:id/role
Update user role.

**Body:**
```json
{
  "role": "ADMIN"
}
```

---

## Media

**Media endpoints require admin authentication.**

### POST /media/upload
Upload image or video.

**Form Data:**
- `file`: File to upload (max 10MB)

### GET /media
Get all media files.

### DELETE /media/:id
Delete media file.

---

## Error Responses

Error responses follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": {
    "field": "error detail"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Payment endpoints: 3 requests per minute

Rate limit info is included in response headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
