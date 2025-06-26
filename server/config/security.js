// Security configuration for the application
const securityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || '7d',
    issuer: 'resetcorp-api',
    audience: 'resetcorp-web',
    algorithm: 'HS256'
  },

  // Password Configuration
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
  },

  // Rate Limiting Configuration
  rateLimit: {
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per window
      skipSuccessfulRequests: true
    },
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // 100 requests per window
    },
    email: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3 // 3 email requests per hour
    }
  },

  // File Upload Configuration
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxFiles: 1
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count']
  },

  // Security Headers Configuration
  securityHeaders: {
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
  },

  // Account Lockout Configuration
  accountLockout: {
    maxAttempts: 5,
    lockoutDuration: 2 * 60 * 60 * 1000, // 2 hours
    resetOnSuccess: true
  },

  // Input Validation Configuration
  validation: {
    name: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/
    },
    email: {
      pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },
    phone: {
      pattern: /^[\+]?[1-9][\d]{0,15}$/
    },
    password: {
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    }
  },

  // Session Configuration
  session: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined',
    includeSensitiveData: process.env.NODE_ENV !== 'production'
  }
};

// Validation functions
const validateSecurityConfig = () => {
  const errors = [];

  if (!securityConfig.jwt.secret) {
    errors.push('JWT_SECRET environment variable is required');
  }

  if (securityConfig.jwt.secret && securityConfig.jwt.secret.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  }

  // Check for email credentials but don't fail if missing (make them optional)
  if (!process.env.BREVO_USER || !process.env.BREVO_PASSWORD) {
    console.warn('⚠️  Email service credentials (BREVO_USER, BREVO_PASSWORD) are missing - email functionality will be disabled');
  }

  if (!process.env.MONGODB_URI) {
    errors.push('MONGODB_URI environment variable is required');
  }

  if (errors.length > 0) {
    throw new Error(`Security configuration errors:\n${errors.join('\n')}`);
  }
};

// Generate secure random string
const generateSecureToken = (length = 32) => {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
};

module.exports = {
  securityConfig,
  validateSecurityConfig,
  generateSecureToken
}; 