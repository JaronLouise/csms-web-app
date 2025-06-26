const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }

  const payload = {
    id: user._id,
    role: user.role,
    email: user.email
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRE || '7d',
    issuer: 'resetcorp-api',
    audience: 'resetcorp-web',
    algorithm: 'HS256'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

module.exports = generateToken;
