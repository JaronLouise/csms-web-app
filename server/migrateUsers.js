const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const migrateUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cspsdb');
    console.log('Connected to MongoDB');

    // Update all users who don't have isActive field or have it set to false
    const result = await User.updateMany(
      { $or: [{ isActive: { $exists: false } }, { isActive: false }] },
      { $set: { isActive: true } }
    );

    console.log(`✅ Migration completed!`);
    console.log(`📊 Users updated: ${result.modifiedCount}`);
    console.log(`📊 Total users matched: ${result.matchedCount}`);

    // Show all users
    const users = await User.find({}, 'name email role isActive');
    console.log('\n📋 Current users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateUsers(); 