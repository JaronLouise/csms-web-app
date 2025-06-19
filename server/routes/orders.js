const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder); // place order
router.get('/', protect, getMyOrders); // customer orders
router.get('/:id', protect, getOrderById); // single order
router.get('/admin/all', protect, admin, getAllOrders); // admin only
router.put('/:id/status', protect, admin, updateOrderStatus); // admin update

module.exports = router;
