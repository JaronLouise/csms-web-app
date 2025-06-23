const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All cart routes require authentication
router.use(protect);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/add', addToCart);

// Update cart item quantity
router.put('/items/:productId', updateCartItem);

// Remove item from cart
router.delete('/items/:productId', removeFromCart);

// Clear entire cart
router.delete('/clear', clearCart);

module.exports = router; 