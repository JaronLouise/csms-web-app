const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');

// Upload image to Firebase Storage
router.post('/image', protect, admin, upload.single('image'), uploadImage);

// Delete image from Firebase Storage
router.delete('/image', protect, admin, deleteImage);

module.exports = router;