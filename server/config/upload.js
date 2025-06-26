const multer = require('multer');
const path = require('path');

// Use memory storage for multer
const storage = multer.memoryStorage();

// Enhanced file filter with more security checks
const fileFilter = (req, file, cb) => {
  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
  }

  // Check MIME type
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type detected!'), false);
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return cb(new Error('File size too large. Maximum size is 5MB.'), false);
  }

  // Sanitize filename
  const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  file.originalname = sanitizedFilename;

  cb(null, true);
};

// Enhanced multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1, // Only allow 1 file per request
    fieldSize: 1024 * 1024 // 1MB for text fields
  }
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Only one file allowed.' });
    }
    if (err.code === 'LIMIT_FIELD_SIZE') {
      return res.status(400).json({ message: 'Field too large.' });
    }
  }
  
  if (err.message) {
    return res.status(400).json({ message: err.message });
  }
  
  next(err);
};

module.exports = { upload, handleUploadError };
