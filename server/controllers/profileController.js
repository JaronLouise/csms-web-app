const { uploadImage, deleteImage } = require('../config/supabase');
const User = require('../models/User');

// POST /profile/picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    console.log('=== PROFILE PICTURE UPLOAD REQUEST ===');
    console.log('Request received at:', new Date().toISOString());
    console.log('User ID:', req.user?.id);
    console.log('File present:', !!req.file);
    console.log('Request headers:', req.headers);
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Get existing user to check if they have a profile picture to delete
    const existingUser = await User.findById(req.user.id);
    if (existingUser && existingUser.profilePicture) {
      // Delete old profile picture from Supabase if it exists
      try {
        await deleteImage(existingUser.profilePicture);
        console.log('✅ Deleted old profile picture:', existingUser.profilePicture);
      } catch (deleteError) {
        console.error('❌ Failed to delete old profile picture:', deleteError);
        // Continue with upload even if delete fails
      }
    }

    // Upload to Supabase Storage in 'profiles' bucket
    console.log('📤 Starting Supabase upload to profiles bucket...');
    const result = await uploadImage(req.file, 'profiles');
    console.log('✅ Supabase upload completed:', result);

    // Update user profilePicture with the Supabase URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: result.url },
      { new: true }
    );

    console.log('✅ User updated with new profile picture');
    console.log('New profile picture URL:', result.url);

    res.json({ 
      message: 'Profile picture uploaded successfully.', 
      profilePicture: result.url, 
      user 
    });
  } catch (error) {
    console.error('❌ Profile picture upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Failed to upload profile picture.' });
  }
}; 