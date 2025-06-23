// server.js
const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();
const PORT = process.env.PORT || 5000;

console.log('=== STARTING SERVER ===');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);

connectDB().then(() => {
  console.log('=== DATABASE CONNECTED ===');
  app.listen(PORT, () => {
    console.log(`=== SERVER STARTED ===`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Ready to handle requests...');
  });
}).catch(err => {
  console.error('=== DATABASE CONNECTION FAILED ===');
  console.error(err);
  process.exit(1);
});