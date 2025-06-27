// app.js
console.log('=== APP.JS LOADED - UPDATED CODE VERSION ===');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import security middleware
const { authLimiter, apiLimiter, emailLimiter } = require('./middleware/rateLimit');
const { sanitizeBody } = require('./middleware/validation');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload'); 
const adminRoutes = require('./routes/admin');
const serviceRoutes = require('./routes/services');
const emailRoutes = require('./routes/emails');
const cartRoutes = require('./routes/cart');

const app = express();

// Enhanced security headers with Helmet
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

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    console.log('=== CORS CHECK ===');
    console.log('Origin:', origin);
    
    const allowedOrigins = [
      'http://localhost:5173', // Development
      'http://localhost:3000', // Alternative dev port
      process.env.CORS_ORIGIN, // Production frontend URL from environment
    ];
    
    // Check exact string matches first
    if (allowedOrigins.includes(origin)) {
      console.log('Origin matched exact string');
      return callback(null, true);
    }
    
    // Check Vercel domains with more permissive regex
    if (origin.includes('.vercel.app')) {
      console.log('Origin is a Vercel domain, allowing');
      return callback(null, true);
    }
    
    // Check Netlify domains
    if (origin.includes('.netlify.app')) {
      console.log('Origin is a Netlify domain, allowing');
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count']
};

app.use(cors(corsOptions));

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Input sanitization middleware
app.use(sanitizeBody);

// Rate limiting middleware
app.use('/api/auth', authLimiter);
app.use('/api/emails', emailLimiter);
app.use('/api', apiLimiter);

// Custom logging middleware for products
app.use('/api/products', (req, res, next) => {
  console.log(`=== PRODUCTS API REQUEST ===`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Body:`, req.body);
  console.log(`Params:`, req.params);
  console.log(`Query:`, req.query);
  console.log(`Headers:`, req.headers);
  next();
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes); 
app.use('/api/services', serviceRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/cart', cartRoutes);

// Serve static files with enhanced security headers
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.CORS_ORIGIN,
    ];
    
    // Check exact string matches first
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    // Check Vercel domains
    else if (origin.includes('.vercel.app')) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    // Check Netlify domains
    else if (origin.includes('.netlify.app')) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  }
  
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
