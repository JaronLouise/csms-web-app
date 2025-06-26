const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder); // place order
router.get('/', protect, getMyOrders); // customer orders
router.get('/admin/all', protect, admin, getAllOrders); // admin only - must come before /:id
router.get('/:id', protect, getOrderById); // single order
router.put('/:id/status', protect, admin, updateOrderStatus); // admin update
router.put('/:id/cancel', protect, cancelOrder); // client cancel order

module.exports = router;
