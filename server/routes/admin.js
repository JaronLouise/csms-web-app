console.log('!!! ADMIN ROUTES LOADED !!!');
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllOrders,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All routes in this file are prefixed with /api/admin and are protected by admin middleware
router.use(protect, admin);

// User management routes
router.route('/users').get(getAllUsers);
router
  .route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Order management routes
router.route('/orders').get(getAllOrders);

module.exports = router;