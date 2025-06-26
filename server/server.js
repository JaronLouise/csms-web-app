// Load environment variables first
require('dotenv').config();

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