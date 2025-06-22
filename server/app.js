// app.js
console.log('=== APP.JS LOADED - UPDATED CODE VERSION ===');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

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

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

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

// Serve static files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, 'uploads')));

const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;