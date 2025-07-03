const rateLimit = require('express-rate-limit');

// Environment-based rate limiting
const isDevelopment = process.env.NODE_ENV === 'development';

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 50 : 10, // More permissive in development
  message: {
    error: 'Too many authentication attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    // Use IP address for rate limiting
    return req.ip || req.connection.remoteAddress;
  },
  handler: (req, res) => {
    res.setHeader('Retry-After', '900'); // 15 minutes in seconds
    res.status(429).json({
      error: 'Too many authentication attempts, please try again after 15 minutes'
    });
  }
});

// Rate limiting for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 500, // Much more permissive in development
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    res.setHeader('Retry-After', '900'); // 15 minutes in seconds
    res.status(429).json({
      error: 'Too many requests from this IP, please try again after 15 minutes'
    });
  }
});

// Rate limiting for email endpoints
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDevelopment ? 50 : 20, // More permissive in development
  message: {
    error: 'Too many email requests, please try again after 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    res.setHeader('Retry-After', '3600'); // 1 hour in seconds
    res.status(429).json({
      error: 'Too many email requests, please try again after 1 hour'
    });
  }
});

module.exports = {
  authLimiter,
  apiLimiter,
  emailLimiter
}; 