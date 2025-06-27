# API Reference Documentation

This document provides a comprehensive reference for all API endpoints in the CSMS web application.

## 🔗 Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## 🔐 Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 📋 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## 🔑 Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "user",
      "createdAt": "2024-12-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### GET /api/auth/me
Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "user",
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  }
}
```

### PUT /api/auth/profile
Update user profile (requires authentication).

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567891"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1234567891",
      "role": "user"
    }
  },
  "message": "Profile updated successfully"
}
```

## 📦 Product Endpoints

### GET /api/products
Get all products with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category ID
- `search` (string): Search in product name and description
- `sort` (string): Sort field (name, price, createdAt)
- `order` (string): Sort order (asc, desc)

**Example Request:**
```http
GET /api/products?page=1&limit=5&category=507f1f77bcf86cd799439012&search=laptop
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Gaming Laptop",
        "description": "High-performance gaming laptop",
        "price": 1299.99,
        "category": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Electronics"
        },
        "image": "uploads/laptop.jpg",
        "stock": 15,
        "createdAt": "2024-12-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 25,
      "pages": 5
    }
  }
}
```

### GET /api/products/:id
Get a specific product by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Gaming Laptop",
      "description": "High-performance gaming laptop with RTX 4080",
      "price": 1299.99,
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Electronics"
      },
      "image": "uploads/laptop.jpg",
      "stock": 15,
      "specifications": {
        "processor": "Intel i7-13700K",
        "ram": "32GB DDR5",
        "storage": "1TB NVMe SSD"
      },
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  }
}
```

### POST /api/products (Admin Only)
Create a new product.

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "507f1f77bcf86cd799439012",
  "stock": 50,
  "specifications": {
    "brand": "Brand Name",
    "model": "Model Number"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "507f1f77bcf86cd799439014",
      "name": "New Product",
      "description": "Product description",
      "price": 99.99,
      "category": "507f1f77bcf86cd799439012",
      "stock": 50,
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  },
  "message": "Product created successfully"
}
```

### PUT /api/products/:id (Admin Only)
Update an existing product.

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 89.99,
  "stock": 45
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Updated Product Name",
      "price": 89.99,
      "stock": 45
    }
  },
  "message": "Product updated successfully"
}
```

### DELETE /api/products/:id (Admin Only)
Delete a product.

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## 🛒 Cart Endpoints

### GET /api/cart
Get user's shopping cart (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "_id": "507f1f77bcf86cd799439015",
      "user": "507f1f77bcf86cd799439011",
      "items": [
        {
          "product": {
            "_id": "507f1f77bcf86cd799439013",
            "name": "Gaming Laptop",
            "price": 1299.99,
            "image": "uploads/laptop.jpg"
          },
          "quantity": 2,
          "price": 1299.99
        }
      ],
      "total": 2599.98,
      "updatedAt": "2024-12-01T10:00:00.000Z"
    }
  }
}
```

### POST /api/cart/add
Add item to cart (requires authentication).

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439013",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [...],
      "total": 2599.98
    }
  },
  "message": "Item added to cart"
}
```

### PUT /api/cart/update/:productId
Update cart item quantity (requires authentication).

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [...],
      "total": 3899.97
    }
  },
  "message": "Cart updated successfully"
}
```

### DELETE /api/cart/remove/:productId
Remove item from cart (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [...],
      "total": 1299.99
    }
  },
  "message": "Item removed from cart"
}
```

### DELETE /api/cart/clear
Clear entire cart (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

## 📋 Order Endpoints

### GET /api/orders
Get user's orders (requires authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by order status

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "507f1f77bcf86cd799439016",
        "user": "507f1f77bcf86cd799439011",
        "items": [
          {
            "product": {
              "_id": "507f1f77bcf86cd799439013",
              "name": "Gaming Laptop",
              "price": 1299.99
            },
            "quantity": 1,
            "price": 1299.99
          }
        ],
        "total": 1299.99,
        "status": "pending",
        "shippingAddress": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001"
        },
        "createdAt": "2024-12-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

### POST /api/orders
Create a new order (requires authentication).

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439013",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439016",
      "user": "507f1f77bcf86cd799439011",
      "items": [...],
      "total": 1299.99,
      "status": "pending",
      "orderNumber": "ORD-2024-001"
    }
  },
  "message": "Order created successfully"
}
```

### GET /api/orders/:id
Get specific order details (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439016",
      "user": "507f1f77bcf86cd799439011",
      "items": [...],
      "total": 1299.99,
      "status": "pending",
      "shippingAddress": {...},
      "trackingNumber": "TRK123456789",
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  }
}
```

## 🛠️ Service Endpoints

### GET /api/services
Get all services.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `category` (string): Filter by category

**Response:**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "_id": "507f1f77bcf86cd799439017",
        "name": "Computer Repair",
        "description": "Professional computer repair services",
        "price": 75.00,
        "category": "Repair",
        "duration": "2-3 hours",
        "image": "uploads/repair.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "pages": 1
    }
  }
}
```

### GET /api/services/:id
Get specific service details.

**Response:**
```json
{
  "success": true,
  "data": {
    "service": {
      "_id": "507f1f77bcf86cd799439017",
      "name": "Computer Repair",
      "description": "Professional computer repair services including hardware and software issues",
      "price": 75.00,
      "category": "Repair",
      "duration": "2-3 hours",
      "image": "uploads/repair.jpg",
      "details": {
        "includes": ["Hardware diagnostics", "Software troubleshooting", "Virus removal"],
        "warranty": "30 days"
      }
    }
  }
}
```

## 📧 Email Endpoints

### POST /api/emails/contact
Send contact form email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "I have a question about your services."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

## 📁 File Upload Endpoints

### POST /api/upload/image
Upload an image file (requires authentication).

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `image` field

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "product-image-123.jpg",
    "url": "/uploads/product-image-123.jpg",
    "size": 1024000
  },
  "message": "Image uploaded successfully"
}
```

## 🏷️ Category Endpoints

### GET /api/categories
Get all categories.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Electronics",
        "description": "Electronic devices and accessories",
        "image": "uploads/electronics.jpg"
      }
    ]
  }
}
```

## 👨‍💼 Admin Endpoints

### GET /api/admin/dashboard
Get admin dashboard statistics (admin only).

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 150,
      "totalOrders": 75,
      "totalProducts": 45,
      "totalRevenue": 12500.00,
      "recentOrders": [...],
      "topProducts": [...]
    }
  }
}
```

### GET /api/admin/users
Get all users (admin only).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "2024-12-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "pages": 15
    }
  }
}
```

### PUT /api/admin/users/:id
Update user role (admin only).

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  },
  "message": "User role updated successfully"
}
```

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `INVALID_CREDENTIALS` | Invalid email or password |
| `USER_NOT_FOUND` | User not found |
| `PRODUCT_NOT_FOUND` | Product not found |
| `ORDER_NOT_FOUND` | Order not found |
| `INSUFFICIENT_STOCK` | Product out of stock |
| `INVALID_INPUT` | Invalid input data |
| `FILE_TOO_LARGE` | File size exceeds limit |
| `INVALID_FILE_TYPE` | File type not allowed |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

## 🔒 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per 15 minutes
- **Email endpoints**: 3 requests per 15 minutes
- **General API**: 100 requests per 15 minutes

## 📝 Testing the API

### Using cURL
```bash
# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test protected endpoint
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman
1. Import the API collection
2. Set up environment variables
3. Use the pre-request scripts for authentication
4. Test all endpoints systematically

---

**API Version**: 1.0  
**Last Updated**: December 2024 