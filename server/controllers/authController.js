const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create user with enhanced validation
    const user = await User.create({ 
      name, 
      email, 
      password,
      role: role || 'customer' 
    });

    // Generate token with enhanced security
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle specific validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }
    
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.' 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const passwordMatch = await user.matchPassword(password);
    
    if (!passwordMatch) {
      // Increment failed login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get current user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -loginAttempts -lockUntil')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Failed to load profile' });
  }
};

// @desc Update current user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }
    }

    // Update fields with validation
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }

    // Update profile fields
    if (req.body.phone !== undefined) user.profile.phone = req.body.phone;

    // Initialize address if it doesn't exist
    if (!user.profile.address) {
      user.profile.address = {};
    }

    // Update address fields
    if (req.body.address?.street !== undefined) user.profile.address.street = req.body.address.street;
    if (req.body.address?.city !== undefined) user.profile.address.city = req.body.address.city;
    if (req.body.address?.state !== undefined) user.profile.address.state = req.body.address.state;
    if (req.body.address?.zipCode !== undefined) user.profile.address.zipCode = req.body.address.zipCode;

    const updated = await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        profile: updated.profile,
        profilePicture: updated.profilePicture
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }
    
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
