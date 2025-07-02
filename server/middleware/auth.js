const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  console.log('=== AUTH MIDDLEWARE: PROTECT ===');
  console.log('Headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted:', token ? 'EXISTS' : 'NOT FOUND');
  }

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    // Verify token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not configured');
    }

    console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'EXISTS' : 'NOT FOUND');
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
    console.log('Token decoded successfully:', decoded);

    // Find user and check if still exists
    console.log('Looking for user with ID:', decoded.id);
    const user = await User.findById(decoded.id)
      .select('-password -loginAttempts -lockUntil')
      .lean();

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ 
        message: 'Token is valid but user no longer exists.' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('User account is deactivated');
      return res.status(401).json({ 
        message: 'Account is deactivated.' 
      });
    }

    console.log('User authenticated successfully:', user.email);
    console.log('User object being set on req.user:', {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
    });
    
    // Add user to request object
    req.user = user;
    console.log('req.user set successfully:', req.user ? 'YES' : 'NO');
    next();
  } catch (err) {
    console.error('Token verification error:', err);

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.' 
      });
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired.' 
      });
    }

    if (err.name === 'NotBeforeError') {
      return res.status(401).json({ 
        message: 'Token not active.' 
      });
    }

    res.status(401).json({ 
      message: 'Token verification failed.' 
    });
  }
};

const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required.' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Admin access required.' 
    });
  }

  next();
};

// Optional authentication middleware
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not configured');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256']
      });

      const user = await User.findById(decoded.id)
        .select('-password -loginAttempts -lockUntil')
        .lean();

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (err) {
      // Silently fail for optional auth
      console.log('Optional auth failed:', err.message);
    }
  }

  next();
};

module.exports = { protect, admin, optionalAuth };
