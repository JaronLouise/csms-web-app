const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const { uploadImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');

router.post('/image', protect, admin, upload.single('image'), uploadImage);

module.exports = router;