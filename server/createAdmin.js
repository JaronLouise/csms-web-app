const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cspsdb');
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: '22-03531@g.batstate-u.edu.ph' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: 22-03531@g.batstate-u.edu.ph');
      console.log('You can now log in with this email and your password.');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: '22-03531@g.batstate-u.edu.ph',
      password: 'admin123', // You can change this password
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Email: 22-03531@g.batstate-u.edu.ph');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('\nYou can now log in to the admin panel with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the function
createAdminUser(); 