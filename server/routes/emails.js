const express = require('express');
const router = express.Router();
const {
  sendContactEmail,
  sendQuoteEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate
} = require('../controllers/emailController');
const { protect } = require('../middleware/auth');
const { validateContactForm, validateQuoteRequest, handleValidationErrors } = require('../middleware/validation');

// Public routes (no authentication required)
router.post('/contact', validateContactForm, handleValidationErrors, sendContactEmail);
router.post('/quote', validateQuoteRequest, handleValidationErrors, sendQuoteEmail);

// Protected routes (authentication required)
router.post('/order-confirmation/:orderId', protect, sendOrderConfirmation);
router.post('/order-status-update/:orderId', protect, sendOrderStatusUpdate);

module.exports = router; 