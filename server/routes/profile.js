const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload, handleUploadError } = require('../config/upload');
const { uploadProfilePicture } = require('../controllers/profileController');

// Test route to verify profile routes are working
router.get('/test', protect, (req, res) => {
  res.json({ message: 'Profile routes are working!', user: req.user.id });
});

// Upload profile picture for logged-in user
router.post('/picture', protect, upload.single('image'), handleUploadError, uploadProfilePicture);

module.exports = router; 