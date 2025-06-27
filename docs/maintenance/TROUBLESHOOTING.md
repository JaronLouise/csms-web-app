# Troubleshooting Guide

This guide provides solutions for common issues that may arise during development, deployment, and maintenance of the CSMS web application.

## 🚨 Common Issues & Solutions

### 1. Development Environment Issues

#### Node.js Version Problems

**Issue**: "Node version not supported" or build failures
```bash
# Error: Node version 16.x is not supported
```

**Solution**:
```bash
# Check current Node.js version
node --version

# Install Node.js 18+ using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Or download from nodejs.org
# https://nodejs.org/en/download/
```

#### Package Installation Issues

**Issue**: npm install fails or packages missing
```bash
# Error: Cannot find module 'express'
# Error: npm ERR! code ENOENT
```

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for network issues
npm config set registry https://registry.npmjs.org/

# Use yarn as alternative
npm install -g yarn
yarn install
```

#### Port Already in Use

**Issue**: "Port 5000 is already in use"
```bash
# Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions**:
```bash
# Find process using port
lsof -i :5000
# or
netstat -tulpn | grep :5000

# Kill the process
kill -9 <PID>

# Use different port
PORT=5001 npm run dev

# Check for multiple Node processes
ps aux | grep node
pkill -f node
```

### 2. Database Connection Issues

#### MongoDB Connection Failures

**Issue**: "MongoDB connection failed"
```bash
# Error: MongooseServerSelectionError: connect ECONNREFUSED
# Error: Authentication failed
```

**Solutions**:

1. **Check Connection String**
   ```bash
   # Verify MONGODB_URI format
   echo $MONGODB_URI
   # Should be: mongodb+srv://username:password@cluster.mongodb.net/database
   ```

2. **Test Connection**
   ```bash
   # Test with MongoDB Compass
   # Or use mongo shell
   mongosh "mongodb+srv://cluster.mongodb.net/database"
   ```

3. **Check Network Access**
   - Go to MongoDB Atlas Dashboard
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` for all IPs (development)
   - Add specific IPs for production

4. **Verify Credentials**
   ```bash
   # Check username/password
   # Reset database user if needed
   # Ensure user has correct permissions
   ```

#### Database Schema Issues

**Issue**: "Schema validation failed"
```bash
# Error: ValidationError: Path `email` is required
```

**Solutions**:
```bash
# Check model definitions
# Verify required fields are being sent
# Check data types match schema

# Example fix for User model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  }
});
```

### 3. Authentication Issues

#### JWT Token Problems

**Issue**: "Invalid token" or "Token expired"
```bash
# Error: JsonWebTokenError: invalid token
# Error: TokenExpiredError: jwt expired
```

**Solutions**:

1. **Check JWT Secret**
   ```bash
   # Verify JWT_SECRET is set
   echo $JWT_SECRET
   
   # Generate new secret if needed
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Check Token Expiration**
   ```javascript
   // Verify JWT_EXPIRE setting
   const JWT_EXPIRE = '7d'; // 7 days
   ```

3. **Clear Browser Storage**
   ```javascript
   // Clear localStorage
   localStorage.removeItem('token');
   localStorage.removeItem('user');
   ```

4. **Check Token Format**
   ```javascript
   // Ensure token is sent correctly
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

#### Login Failures

**Issue**: "Invalid credentials" or login not working
```bash
# Error: Invalid email or password
```

**Solutions**:

1. **Check Password Hashing**
   ```javascript
   // Verify bcrypt is working
   const bcrypt = require('bcryptjs');
   const isMatch = await bcrypt.compare(password, hashedPassword);
   ```

2. **Reset User Password**
   ```bash
   # Create password reset script
   node -e "
   const bcrypt = require('bcryptjs');
   const password = 'newpassword123';
   bcrypt.hash(password, 12).then(hash => console.log(hash));
   "
   ```

3. **Check Email Format**
   ```javascript
   // Verify email validation
   const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
   ```

### 4. API Issues

#### CORS Errors

**Issue**: "CORS policy blocked request"
```bash
# Error: Access to fetch at 'http://localhost:5000/api/products' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions**:

1. **Check CORS Configuration**
   ```javascript
   // Verify CORS_ORIGIN in backend
   const corsOptions = {
     origin: ['http://localhost:5173', 'https://your-domain.com'],
     credentials: true
   };
   ```

2. **Update Environment Variables**
   ```bash
   # Set CORS_ORIGIN correctly
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

3. **Check Request Headers**
   ```javascript
   // Ensure proper headers in frontend
   headers: {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${token}`
   }
   ```

#### API Endpoint Not Found

**Issue**: "404 Not Found" for API routes
```bash
# Error: Cannot GET /api/products
```

**Solutions**:

1. **Check Route Registration**
   ```javascript
   // Verify routes are registered in app.js
   app.use('/api/products', productRoutes);
   app.use('/api/auth', authRoutes);
   ```

2. **Check File Structure**
   ```bash
   # Ensure route files exist
   ls server/routes/
   # Should show: products.js, auth.js, etc.
   ```

3. **Check Server Running**
   ```bash
   # Verify server is running
   curl http://localhost:5000/api/health
   ```

### 5. File Upload Issues

#### Upload Failures

**Issue**: "File upload failed" or "File too large"
```bash
# Error: File too large
# Error: Only image files are allowed
```

**Solutions**:

1. **Check File Size Limits**
   ```javascript
   // Verify multer configuration
   limits: {
     fileSize: 5 * 1024 * 1024 // 5MB
   }
   ```

2. **Check File Types**
   ```javascript
   // Verify file filter
   const allowedTypes = /jpeg|jpg|png|gif|webp/;
   ```

3. **Check Upload Directory**
   ```bash
   # Ensure uploads directory exists
   mkdir -p server/uploads
   chmod 755 server/uploads
   ```

4. **Check Disk Space**
   ```bash
   # Check available disk space
   df -h
   ```

#### Image Display Issues

**Issue**: Images not loading or broken
```bash
# Error: 404 for image files
```

**Solutions**:

1. **Check File Paths**
   ```javascript
   // Verify static file serving
   app.use('/uploads', express.static('uploads'));
   ```

2. **Check File Permissions**
   ```bash
   # Set correct permissions
   chmod 644 server/uploads/*
   ```

3. **Check URL Format**
   ```javascript
   // Ensure correct image URLs
   const imageUrl = `${API_URL}/uploads/${filename}`;
   ```

### 6. Frontend Issues

#### React Build Failures

**Issue**: "Build failed" or "Module not found"
```bash
# Error: Cannot resolve module 'react'
# Error: Build failed with errors
```

**Solutions**:

1. **Check Dependencies**
   ```bash
   cd client
   npm install
   npm audit fix
   ```

2. **Check Import Statements**
   ```javascript
   // Verify imports are correct
   import React from 'react';
   import { useState, useEffect } from 'react';
   ```

3. **Clear Build Cache**
   ```bash
   # Clear Vite cache
   rm -rf node_modules/.vite
   npm run build
   ```

#### State Management Issues

**Issue**: "Context not found" or state not updating
```bash
# Error: useContext must be used within a Provider
```

**Solutions**:

1. **Check Context Providers**
   ```jsx
   // Ensure providers wrap the app
   <AuthProvider>
     <CartProvider>
       <App />
     </CartProvider>
   </AuthProvider>
   ```

2. **Check Context Usage**
   ```jsx
   // Verify context is imported and used correctly
   import { useContext } from 'react';
   import { AuthContext } from './context/AuthContext';
   
   const { user, login } = useContext(AuthContext);
   ```

### 7. Deployment Issues

#### Build Failures in Production

**Issue**: "Build failed" on deployment platform
```bash
# Error: Build command failed
# Error: Environment variables not found
```

**Solutions**:

1. **Check Environment Variables**
   ```bash
   # Verify all required variables are set
   # Check platform-specific variable names
   # Ensure no typos in variable names
   ```

2. **Check Build Commands**
   ```json
   // Verify package.json scripts
   {
     "scripts": {
       "build": "vite build",
       "start": "node server.js"
     }
   }
   ```

3. **Check Node.js Version**
   ```bash
   # Ensure platform supports Node.js 18+
   # Set Node.js version in platform settings
   ```

#### Domain/SSL Issues

**Issue**: "SSL certificate error" or "Domain not found"
```bash
# Error: SSL certificate not valid
# Error: Domain not configured
```

**Solutions**:

1. **Check DNS Configuration**
   ```bash
   # Verify DNS records
   nslookup your-domain.com
   dig your-domain.com
   ```

2. **Check SSL Certificate**
   ```bash
   # Verify SSL certificate
   openssl s_client -connect your-domain.com:443
   ```

3. **Platform-Specific SSL**
   - Vercel: Automatic SSL
   - Render: Automatic SSL
   - Railway: Automatic SSL

### 8. Performance Issues

#### Slow Page Loads

**Issue**: Pages loading slowly or timeouts
```bash
# Error: Request timeout
# Error: Page load time > 3 seconds
```

**Solutions**:

1. **Check Database Queries**
   ```javascript
   // Add database indexes
   db.products.createIndex({ "name": "text" });
   db.orders.createIndex({ "user": 1 });
   ```

2. **Optimize Images**
   ```bash
   # Compress images
   # Use WebP format
   # Implement lazy loading
   ```

3. **Check API Response Times**
   ```javascript
   // Add response time logging
   app.use((req, res, next) => {
     const start = Date.now();
     res.on('finish', () => {
       console.log(`${req.method} ${req.url} - ${Date.now() - start}ms`);
     });
     next();
   });
   ```

#### Memory Leaks

**Issue**: "Out of memory" or high memory usage
```bash
# Error: JavaScript heap out of memory
```

**Solutions**:

1. **Check for Memory Leaks**
   ```javascript
   // Monitor memory usage
   setInterval(() => {
     const used = process.memoryUsage();
     console.log(`Memory: ${Math.round(used.heapUsed / 1024 / 1024)}MB`);
   }, 30000);
   ```

2. **Optimize Database Connections**
   ```javascript
   // Use connection pooling
   mongoose.connect(uri, {
     maxPoolSize: 10,
     serverSelectionTimeoutMS: 5000
   });
   ```

### 9. Email Issues

#### Email Not Sending

**Issue**: "Email failed to send" or no emails received
```bash
# Error: SMTP connection failed
# Error: Authentication failed
```

**Solutions**:

1. **Check SMTP Configuration**
   ```bash
   # Verify email settings
   echo $EMAIL_HOST
   echo $EMAIL_PORT
   echo $EMAIL_USER
   echo $EMAIL_PASS
   ```

2. **Test SMTP Connection**
   ```javascript
   // Test email configuration
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransporter({
     host: process.env.EMAIL_HOST,
     port: process.env.EMAIL_PORT,
     secure: false,
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS
     }
   });
   
   transporter.verify((error, success) => {
     if (error) {
       console.log('SMTP Error:', error);
     } else {
       console.log('SMTP Server ready');
     }
   });
   ```

3. **Check Email Provider Settings**
   - Gmail: Enable 2FA and app passwords
   - SendGrid: Verify sender email
   - Check spam folder

### 10. Security Issues

#### Rate Limiting Problems

**Issue**: "Too many requests" or rate limiting not working
```bash
# Error: Rate limit exceeded
```

**Solutions**:

1. **Check Rate Limit Configuration**
   ```javascript
   // Verify rate limit settings
   const apiLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // requests per window
   });
   ```

2. **Check IP Detection**
   ```javascript
   // Ensure correct IP detection
   app.set('trust proxy', 1);
   ```

#### Security Headers Missing

**Issue**: Security warnings or missing headers
```bash
# Warning: Missing security headers
```

**Solutions**:

1. **Check Helmet Configuration**
   ```javascript
   // Verify Helmet is configured
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"]
       }
     }
   }));
   ```

2. **Check HTTPS Enforcement**
   ```javascript
   // Force HTTPS in production
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

## 🔧 Debugging Tools

### 1. Logging

**Add Comprehensive Logging**
```javascript
// Add to server/app.js
const morgan = require('morgan');

// Request logging
app.use(morgan('combined'));

// Custom logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
```

### 2. Error Tracking

**Implement Error Tracking**
```javascript
// Add Sentry for error tracking
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### 3. Health Checks

**Add Health Check Endpoint**
```javascript
// Add to server/app.js
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  });
});
```

## 📞 Getting Help

### 1. Check Logs
```bash
# Application logs
npm run dev

# Platform logs
vercel logs
railway logs
# Check hosting platform dashboard
```

### 2. Common Resources
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)

### 3. Community Support
- Stack Overflow
- GitHub Issues
- Discord/Slack communities

---

**Troubleshooting Guide Version**: 1.0  
**Last Updated**: December 2024 