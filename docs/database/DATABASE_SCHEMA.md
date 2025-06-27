# Database Schema Documentation

This document provides a comprehensive overview of the database schema for the CSMS web application, including all models, relationships, and field definitions.

## 🗄️ Database Overview

- **Database Type**: MongoDB (NoSQL)
- **ODM**: Mongoose
- **Connection**: MongoDB Atlas (cloud) or local MongoDB instance

## 📊 Database Models

### 1. User Model

**File**: `server/models/User.js`

**Schema Definition:**
```javascript
{
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}
```

**Indexes:**
- `email` (unique)
- `role`
- `isActive`

**Virtual Fields:**
- `fullName` - Concatenated first and last name
- `isAdmin` - Boolean check for admin role

**Methods:**
- `getSignedJwtToken()` - Generate JWT token
- `matchPassword(enteredPassword)` - Compare password with hash
- `getResetPasswordToken()` - Generate password reset token

### 2. Product Model

**File**: `server/models/Product.js`

**Schema Definition:**
```javascript
{
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  images: [{
    type: String,
    required: [true, 'Product image is required']
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  specifications: {
    type: Map,
    of: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}
```

**Indexes:**
- `name` (text search)
- `category`
- `isActive`
- `featured`
- `sku` (unique, sparse)
- `tags`

**Virtual Fields:**
- `isInStock` - Boolean check for stock availability
- `formattedPrice` - Price formatted with currency

**Methods:**
- `updateStock(quantity)` - Update stock quantity
- `isAvailable()` - Check if product is available for purchase

### 3. Category Model

**File**: `server/models/Category.js`

**Schema Definition:**
```javascript
{
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    default: 'default-category.jpg'
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  }
}
```

**Indexes:**
- `name` (unique)
- `parent`
- `isActive`
- `slug` (unique)

**Virtual Fields:**
- `productCount` - Number of products in category
- `subcategories` - Child categories

### 4. Order Model

**File**: `server/models/Order.js`

**Schema Definition:**
```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'USA'
    }
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'cash_on_delivery'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  orderNumber: {
    type: String,
    unique: true
  }
}
```

**Indexes:**
- `user`
- `status`
- `paymentStatus`
- `orderNumber` (unique)
- `createdAt`

**Virtual Fields:**
- `itemCount` - Total number of items in order
- `isPaid` - Boolean check for payment status

**Methods:**
- `generateOrderNumber()` - Generate unique order number
- `updateStatus(newStatus)` - Update order status
- `calculateTotal()` - Recalculate order total

### 5. Cart Model

**File**: `server/models/Cart.js`

**Schema Definition:**
```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Cart must belong to a user'],
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    default: 0,
    min: [0, 'Total cannot be negative']
  }
}
```

**Indexes:**
- `user` (unique)

**Virtual Fields:**
- `itemCount` - Total number of items in cart
- `isEmpty` - Boolean check if cart is empty

**Methods:**
- `addItem(productId, quantity)` - Add item to cart
- `removeItem(productId)` - Remove item from cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `clear()` - Clear all items from cart
- `calculateTotal()` - Recalculate cart total

### 6. Service Model

**File**: `server/models/Service.js`

**Schema Definition:**
```javascript
{
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['Repair', 'Maintenance', 'Consultation', 'Installation', 'Other']
  },
  duration: {
    type: String,
    required: [true, 'Service duration is required']
  },
  image: {
    type: String,
    default: 'default-service.jpg'
  },
  details: {
    includes: [String],
    requirements: [String],
    warranty: String,
    notes: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}
```

**Indexes:**
- `name` (text search)
- `category`
- `isActive`
- `featured`

**Virtual Fields:**
- `formattedPrice` - Price formatted with currency
- `durationHours` - Duration converted to hours

## 🔗 Model Relationships

### One-to-Many Relationships
```
User → Orders (One user can have many orders)
User → Cart (One user has one cart)
Category → Products (One category can have many products)
Category → Categories (Self-referencing for subcategories)
```

### Many-to-Many Relationships
```
Orders ↔ Products (Through order items)
Cart ↔ Products (Through cart items)
```

### Relationship Diagram
```
User
├── Orders (1:N)
│   └── OrderItems (N:M with Products)
├── Cart (1:1)
│   └── CartItems (N:M with Products)
└── Profile (1:1)

Category
├── Products (1:N)
└── Subcategories (1:N, self-referencing)

Product
├── OrderItems (N:M with Orders)
├── CartItems (N:M with Cart)
└── Category (N:1)

Service
└── Category (N:1, enum-based)
```

## 📊 Database Indexes

### Performance Indexes
```javascript
// User indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "isActive": 1 })

// Product indexes
db.products.createIndex({ "name": "text", "description": "text" })
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "isActive": 1 })
db.products.createIndex({ "featured": 1 })
db.products.createIndex({ "sku": 1 }, { unique: true, sparse: true })

// Order indexes
db.orders.createIndex({ "user": 1 })
db.orders.createIndex({ "status": 1 })
db.orders.createIndex({ "createdAt": -1 })
db.orders.createIndex({ "orderNumber": 1 }, { unique: true })

// Cart indexes
db.carts.createIndex({ "user": 1 }, { unique: true })

// Category indexes
db.categories.createIndex({ "name": 1 }, { unique: true })
db.categories.createIndex({ "parent": 1 })
db.categories.createIndex({ "slug": 1 }, { unique: true })
```

## 🔄 Data Validation

### Input Validation Rules
```javascript
// User validation
- Email: Must be valid email format
- Password: Minimum 6 characters
- Phone: Optional, must be valid phone format
- Name: Maximum 50 characters

// Product validation
- Name: Maximum 100 characters
- Description: Maximum 1000 characters
- Price: Must be positive number
- Stock: Must be non-negative integer
- SKU: Must be unique if provided

// Order validation
- Items: Must have at least one item
- Quantity: Must be at least 1
- Total: Must be positive number
- Status: Must be valid enum value

// Category validation
- Name: Must be unique, maximum 50 characters
- Slug: Must be unique, lowercase
```

## 🗃️ Data Migration

### Sample Data Seeding
```javascript
// Seed categories
const categories = [
  { name: 'Electronics', description: 'Electronic devices and accessories' },
  { name: 'Computers', description: 'Computer hardware and software', parent: 'Electronics' },
  { name: 'Mobile Devices', description: 'Smartphones and tablets', parent: 'Electronics' }
];

// Seed products
const products = [
  {
    name: 'Gaming Laptop',
    description: 'High-performance gaming laptop',
    price: 1299.99,
    category: 'Computers',
    stock: 15
  }
];

// Seed services
const services = [
  {
    name: 'Computer Repair',
    description: 'Professional computer repair services',
    price: 75.00,
    category: 'Repair',
    duration: '2-3 hours'
  }
];
```

## 🔍 Query Optimization

### Common Queries
```javascript
// Get products with category and pagination
Product.find({ isActive: true })
  .populate('category', 'name')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);

// Get user orders with product details
Order.find({ user: userId })
  .populate('items.product', 'name price image')
  .sort({ createdAt: -1 });

// Search products by name or description
Product.find({
  $text: { $search: searchTerm },
  isActive: true
}).populate('category', 'name');

// Get cart with product details
Cart.findOne({ user: userId })
  .populate('items.product', 'name price image stock');
```

## 🛡️ Data Security

### Sensitive Data Handling
- **Passwords**: Hashed using bcrypt with salt rounds
- **JWT Tokens**: Stored in memory, not database
- **Personal Data**: Encrypted in transit and at rest
- **File Uploads**: Validated and sanitized

### Backup Strategy
- **Automated Backups**: Daily MongoDB Atlas backups
- **Point-in-Time Recovery**: Available for disaster recovery
- **Data Export**: Regular exports for compliance

---

**Schema Version**: 1.0  
**Last Updated**: December 2024 