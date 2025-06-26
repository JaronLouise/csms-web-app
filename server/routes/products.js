const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect, admin } = require('../middleware/auth');
const { upload, handleUploadError } = require('../config/upload');

console.log('=== PRODUCTS ROUTES LOADED - UPDATED CODE VERSION ===');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, upload.single('image'), handleUploadError, createProduct);
router.put('/:id', protect, admin, upload.single('image'), handleUploadError, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
