// Load environment variables first
const path = require('path');
const fs = require('fs');

console.log('Current working directory:', process.cwd());
console.log('Looking for .env file at:', path.resolve('.env'));

// Check if .env file exists
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
  console.log('File size:', fs.statSync(envPath).size, 'bytes');
} else {
  console.log('❌ .env file NOT found');
}

require('dotenv').config();

// Debug: Check if dotenv is working
console.log('=== DOTENV DEBUG ===');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 'NOT FOUND');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('BREVO_USER exists:', !!process.env.BREVO_USER);
console.log('BREVO_PASSWORD exists:', !!process.env.BREVO_PASSWORD);
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('========================');

// server.js
const app = require('./app');
const connectDB = require('./config/database');
const { validateSecurityConfig } = require('./config/security');

const PORT = process.env.PORT || 5000;

// Validate security configuration before starting server
const startServer = async () => {
  try {
    // Validate security configuration
    validateSecurityConfig();
    console.log('✅ Security configuration validated');

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 Security features enabled`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();