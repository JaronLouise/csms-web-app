const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ 
      name, 
      email, 
      password,
      role: role || 'customer' 
    });

    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err); 
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc Get current user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load profile' });
  }
};

// @desc Update current user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if email is being changed and if it's already taken
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }

    user.profile.phone = req.body.phone || user.profile.phone || '';

    // Initialize address if it doesn't exist
    if (!user.profile.address) {
      user.profile.address = {};
    }

    user.profile.address.street = req.body.address?.street || user.profile.address.street || '';
    user.profile.address.city = req.body.address?.city || user.profile.address.city || '';
    user.profile.address.state = req.body.address?.state || user.profile.address.state || '';
    user.profile.address.zipCode = req.body.address?.zipCode || user.profile.address.zipCode || '';

    const updated = await user.save();
    res.json({
      message: 'Profile updated',
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        profile: updated.profile
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
