const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../config/upload');
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');

// Upload image to Supabase Storage
router.post('/image', protect, admin, upload.single('image'), handleUploadError, uploadImage);

// Delete image from Supabase Storage
router.delete('/image', protect, admin, deleteImage);

module.exports = router;