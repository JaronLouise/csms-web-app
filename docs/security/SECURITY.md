# Security Implementation Documentation

This document outlines the comprehensive security measures implemented in the CSMS web application to protect against common web vulnerabilities and ensure data integrity.

## 🛡️ Security Overview

The application implements a multi-layered security approach covering:
- **Authentication & Authorization**
- **Input Validation & Sanitization**
- **Data Protection**
- **API Security**
- **File Upload Security**
- **Infrastructure Security**

## 🔐 Authentication & Authorization

### JWT Implementation

**Token Structure:**
```javascript
// JWT Payload
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "user|admin",
  "iat": 1640995200,
  "exp": 1641600000
}
```

**Token Configuration:**
```javascript
// JWT Settings
const JWT_SECRET = process.env.JWT_SECRET; // 256-bit random string
const JWT_EXPIRE = '7d'; // Token expiration
const JWT_COOKIE_EXPIRE = 7; // Cookie expiration in days

// Token generation
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};
```

**Token Validation:**
```javascript
// Middleware for token verification
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Access denied. No token provided.' }
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Invalid token.' }
    });
  }
};
```

### Password Security

**Password Hashing:**
```javascript
// Using bcrypt with salt rounds
const SALT_ROUNDS = 12;

// Password hashing
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Password verification
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
```

**Password Requirements:**
- Minimum 6 characters
- Recommended: uppercase, lowercase, numbers, symbols
- No common passwords allowed
- Password history tracking (future enhancement)

### Role-Based Access Control (RBAC)

**User Roles:**
```javascript
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Role verification middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Authentication required' }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Insufficient permissions' }
      });
    }

    next();
  };
};

// Usage
app.use('/api/admin', requireRole(['admin']));
```

## 🧹 Input Validation & Sanitization

### Express Validator Implementation

**Validation Rules:**
```javascript
const { body, validationResult } = require('express-validator');

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number')
];

// Product creation validation
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name must be between 1 and 100 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('category')
    .isMongoId()
    .withMessage('Invalid category ID')
];
```

**Validation Middleware:**
```javascript
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      }
    });
  }
  
  next();
};

// Usage
app.post('/api/auth/register', 
  validateRegistration, 
  handleValidationErrors, 
  registerUser
);
```

### XSS Protection

**Input Sanitization:**
```javascript
const xss = require('xss');

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return xss(input, {
      whiteList: {}, // No HTML allowed
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script']
    });
  }
  return input;
};

// Middleware for body sanitization
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};
```

**Content Security Policy:**
```javascript
// Helmet CSP configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
```

## 🚫 Rate Limiting

### API Rate Limiting

**Rate Limit Configuration:**
```javascript
const rateLimit = require('express-rate-limit');

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again later.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED'
    }
  },
  skipSuccessfulRequests: true,
});

// Email rate limiting
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 email requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many email requests, please try again later.',
      code: 'EMAIL_RATE_LIMIT_EXCEEDED'
    }
  },
});
```

**Rate Limit Application:**
```javascript
// Apply rate limiting to specific routes
app.use('/api/auth', authLimiter);
app.use('/api/emails', emailLimiter);
app.use('/api', apiLimiter);
```

## 📁 File Upload Security

### File Upload Validation

**File Upload Configuration:**
```javascript
const multer = require('multer');
const path = require('path');

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});
```

**File Upload Middleware:**
```javascript
// File upload validation middleware
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'No file uploaded',
        code: 'NO_FILE_UPLOADED'
      }
    });
  }

  // Additional file validation
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'File size exceeds limit',
        code: 'FILE_TOO_LARGE'
      }
    });
  }

  next();
};

// Usage
app.post('/api/upload/image', 
  upload.single('image'), 
  validateFileUpload, 
  uploadImage
);
```

### File Security Measures

**File Access Control:**
```javascript
// Serve static files with security headers
app.use('/uploads', (req, res, next) => {
  // Set security headers for uploaded files
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  
  // Validate file path to prevent directory traversal
  const filePath = path.resolve(req.path);
  const uploadsDir = path.resolve('uploads');
  
  if (!filePath.startsWith(uploadsDir)) {
    return res.status(403).json({
      success: false,
      error: { message: 'Access denied' }
    });
  }
  
  next();
}, express.static('uploads'));
```

## 🔒 CORS Configuration

### Cross-Origin Resource Sharing

**CORS Configuration:**
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173', // Development
      'http://localhost:3000', // Alternative dev port
      process.env.CORS_ORIGIN, // Production frontend URL
    ];
    
    // Check exact string matches first
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check deployment platforms
    if (origin.includes('.vercel.app') || origin.includes('.netlify.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count']
};

app.use(cors(corsOptions));
```

## 🛡️ Additional Security Headers

### Helmet Security Headers

**Security Headers Configuration:**
```javascript
app.use(helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // Cross-Origin policies
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  // Other security headers
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));
```

## 🔍 Error Handling Security

### Secure Error Responses

**Error Handler Implementation:**
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging (in production, use proper logging service)
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Don't expose internal errors in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: isProduction ? 'Internal server error' : error.message,
      ...(isProduction ? {} : { stack: err.stack })
    }
  });
};
```

## 🔐 Environment Security

### Environment Variables

**Required Environment Variables:**
```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Security
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

**Environment Validation:**
```javascript
const validateEnvironment = () => {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Call validation on startup
validateEnvironment();
```

## 📊 Security Monitoring

### Request Logging

**Morgan Logging Configuration:**
```javascript
const morgan = require('morgan');

// Custom logging format
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('user', (req) => req.user ? req.user.id : 'anonymous');

// Logging middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :user'));
```

### Security Event Logging

**Security Event Logger:**
```javascript
const logSecurityEvent = (event, details) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user.id : null
  };

  console.log('SECURITY EVENT:', logEntry);
  // In production, send to security monitoring service
};

// Usage examples
logSecurityEvent('LOGIN_ATTEMPT', { email: req.body.email, success: false });
logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip: req.ip, endpoint: req.path });
logSecurityEvent('FILE_UPLOAD', { filename: req.file.filename, size: req.file.size });
```

## 🧪 Security Testing

### Security Test Checklist

**Authentication Tests:**
- [ ] JWT token validation
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts
- [ ] Session timeout
- [ ] Role-based access control

**Input Validation Tests:**
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] File upload validation
- [ ] Input sanitization

**API Security Tests:**
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Error message security
- [ ] HTTPS enforcement
- [ ] Security headers

### Security Headers Test

```bash
# Test security headers
curl -I https://your-domain.com/api/health

# Expected headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# Content-Security-Policy: default-src 'self'
```

## 🚨 Incident Response

### Security Incident Response Plan

**1. Detection**
- Monitor logs for suspicious activity
- Set up alerts for security events
- Regular security audits

**2. Assessment**
- Determine scope and impact
- Identify affected systems and data
- Assess potential data breaches

**3. Containment**
- Isolate affected systems
- Revoke compromised credentials
- Implement temporary security measures

**4. Eradication**
- Remove security threats
- Patch vulnerabilities
- Update security configurations

**5. Recovery**
- Restore affected systems
- Verify security measures
- Monitor for recurrence

**6. Lessons Learned**
- Document incident details
- Update security procedures
- Improve monitoring and detection

---

**Security Version**: 1.0  
**Last Updated**: December 2024 