const express = require('express');
const router = express.Router();
const {
  sendContactEmail,
  sendQuoteEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate
} = require('../controllers/emailController');
const { protect } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/contact', sendContactEmail);
router.post('/quote', sendQuoteEmail);

// Protected routes (authentication required)
router.post('/order-confirmation/:orderId', protect, sendOrderConfirmation);
router.post('/order-status-update/:orderId', protect, sendOrderStatusUpdate);

module.exports = router; 