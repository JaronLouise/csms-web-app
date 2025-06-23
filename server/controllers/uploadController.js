const { uploadImage, deleteImage } = require('../config/supabase');

// Upload image to Supabase Storage
exports.uploadImage = async (req, res) => {
  try {
    console.log('=== UPLOAD CONTROLLER DEBUG ===');
    console.log('Request file:', req.file ? 'Present' : 'Missing');
    console.log('Request query:', req.query);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Get folder from query parameter (default to 'products')
    const folder = req.query.folder || 'products';
    console.log('Upload folder:', folder);

    // Upload to Supabase Storage
    console.log('Starting Supabase upload...');
    const result = await uploadImage(req.file, folder);
    console.log('Supabase upload completed:', result);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: result
    });

  } catch (error) {
    console.error('=== UPLOAD ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    res.status(500).json({ 
      message: 'Failed to upload image',
      error: error.message 
    });
  }
};

// Delete image from Supabase Storage
exports.deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    const result = await deleteImage(public_id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      message: 'Failed to delete image',
      error: error.message 
    });
  }
};
