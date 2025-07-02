const { uploadImage, deleteImage } = require('../config/supabase');
const User = require('../models/User');

// POST /profile/picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    console.log('=== PROFILE PICTURE UPLOAD REQUEST ===');
    console.log('Request received at:', new Date().toISOString());
    console.log('User ID (req.user.id):', req.user?.id);
    console.log('User ID (req.user._id):', req.user?._id);
    console.log('User object:', req.user);
    console.log('File present:', !!req.file);
    console.log('Request headers:', req.headers);
    
    // Check if user is authenticated - use _id since that's how MongoDB stores it
    const userId = req.user?._id || req.user?.id;
    if (!req.user || !userId) {
      console.log('❌ User not authenticated or user ID missing');
      return res.status(401).json({ message: 'User authentication required.' });
    }
    
    console.log('✅ Using user ID:', userId);
    
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
    console.log('🔍 Fetching existing user data...');
    const existingUser = await User.findById(userId);
    console.log('Current user profilePicture:', existingUser?.profilePicture);
    
    if (existingUser && existingUser.profilePicture) {
      // Delete old profile picture from Supabase if it exists
      try {
        console.log('🗑️ Attempting to delete old profile picture...');
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
    console.log('New image URL:', result.url);

    // Update user profilePicture with the Supabase URL
    console.log('💾 Updating user document in database...');
    console.log('Updating profilePicture field to:', result.url);
    
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.url },
      { new: true }
    );

    if (!user) {
      console.log('❌ Failed to update user in database');
      return res.status(500).json({ message: 'Failed to update user profile.' });
    }

    console.log('✅ User updated with new profile picture');
    console.log('Updated user object:', {
      id: user._id,
      name: user.name,
      profilePicture: user.profilePicture
    });

    const responseData = { 
      message: 'Profile picture uploaded successfully.', 
      profilePicture: result.url, 
      user 
    };
    
    console.log('📤 Sending response to client:', responseData);
    res.json(responseData);
    
  } catch (error) {
    console.error('❌ Profile picture upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Failed to upload profile picture.' });
  }
}; 