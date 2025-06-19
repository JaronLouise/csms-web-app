// server.js
const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});