# Deployment Guide

This guide provides comprehensive instructions for deploying the CSMS web application to various platforms and environments.

## 🚀 Deployment Overview

The CSMS application consists of two main components:
- **Frontend**: React application (client directory)
- **Backend**: Node.js/Express API (server directory)

## 📋 Prerequisites

### Required Accounts
- **GitHub/GitLab**: Source code repository
- **MongoDB Atlas**: Database hosting
- **Email Service**: SMTP provider (Gmail, SendGrid, etc.)
- **File Storage**: Cloud storage for uploads (optional)

### Required Tools
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Version control
- **MongoDB Compass**: Database management (optional)

## 🌐 Platform-Specific Deployment

### 1. Vercel Deployment (Frontend)

**Vercel** is recommended for the React frontend due to its excellent React support and automatic deployments.

#### Setup Instructions

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Configure Frontend**
   ```bash
   cd client
   
   # Create vercel.json configuration
   cat > vercel.json << EOF
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   EOF
   ```

4. **Set Environment Variables**
   ```bash
   # In Vercel dashboard or via CLI
   vercel env add VITE_API_URL
   # Enter: https://your-backend-domain.com/api
   
   vercel env add VITE_APP_NAME
   # Enter: CSMS
   ```

5. **Deploy**
   ```bash
   vercel --prod
   ```

#### Vercel Configuration

**vercel.json** (Advanced Configuration):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ],
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### 2. Render Deployment (Backend)

**Render** provides excellent support for Node.js applications with automatic deployments and SSL certificates.

#### Setup Instructions

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   ```
   Name: csms-backend
   Environment: Node
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```

3. **Set Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/csms
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX=100
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=5242880
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy

#### Render Configuration

**render.yaml** (Infrastructure as Code):
```yaml
services:
  - type: web
    name: csms-backend
    env: node
    plan: starter
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: JWT_EXPIRE
        value: 7d
      - key: EMAIL_HOST
        value: smtp.gmail.com
      - key: EMAIL_PORT
        value: 587
      - key: EMAIL_USER
        sync: false
      - key: EMAIL_PASS
        sync: false
      - key: CORS_ORIGIN
        sync: false
      - key: RATE_LIMIT_WINDOW
        value: 15
      - key: RATE_LIMIT_MAX
        value: 100
      - key: UPLOAD_PATH
        value: ./uploads
      - key: MAX_FILE_SIZE
        value: 5242880
```

### 3. Railway Deployment (Alternative Backend)

**Railway** is another excellent option for Node.js applications with automatic deployments.

#### Setup Instructions

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd server
   railway init
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=3000
   railway variables set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/csms
   railway variables set JWT_SECRET=your-super-secret-jwt-key-here
   # ... set all other variables
   ```

5. **Deploy**
   ```bash
   railway up
   ```

### 4. Netlify Deployment (Alternative Frontend)

**Netlify** is another great option for static site hosting.

#### Setup Instructions

1. **Build Configuration**
   ```bash
   cd client
   
   # Create netlify.toml
   cat > netlify.toml << EOF
   [build]
     publish = "dist"
     command = "npm run build"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   EOF
   ```

2. **Deploy via Netlify Dashboard**
   - Connect GitHub repository
   - Set build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Set environment variables
   - Deploy

## 🗄️ Database Setup

### MongoDB Atlas Configuration

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free cluster
   - Choose cloud provider and region

2. **Configure Network Access**
   ```
   IP Access List: 0.0.0.0/0 (allow all IPs)
   ```

3. **Create Database User**
   ```
   Username: csms_user
   Password: strong_password_here
   Role: Atlas admin
   ```

4. **Get Connection String**
   ```
   mongodb+srv://csms_user:password@cluster.mongodb.net/csms?retryWrites=true&w=majority
   ```

5. **Initialize Database**
   ```bash
   # Run seed script
   cd server
   npm run seed
   
   # Create admin user
   node createAdmin.js
   ```

## 📧 Email Configuration

### Gmail SMTP Setup

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2FA

2. **Generate App Password**
   - Go to Security settings
   - Generate app password for "Mail"
   - Use this password in EMAIL_PASS

3. **Environment Variables**
   ```bash
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### SendGrid Alternative

1. **Create SendGrid Account**
   - Sign up at [SendGrid](https://sendgrid.com)
   - Verify sender email

2. **Get API Key**
   - Create API key with "Mail Send" permissions

3. **Environment Variables**
   ```bash
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=your-sendgrid-api-key
   ```

## 🔧 Environment Configuration

### Production Environment Variables

**Backend (.env)**
```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/csms

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

**Frontend (.env)**
```bash
# API Configuration
VITE_API_URL=https://your-backend-domain.render.com/api

# Application
VITE_APP_NAME=CSMS
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

## 🔒 Security Configuration

### SSL/HTTPS Setup

**Automatic SSL (Recommended)**
- Vercel, Render, and Railway provide automatic SSL certificates
- No additional configuration needed

**Manual SSL Setup**
```bash
# For custom domains
# Install SSL certificate
# Configure reverse proxy (nginx)
```

### Domain Configuration

1. **Custom Domain Setup**
   - Purchase domain (Namecheap, GoDaddy, etc.)
   - Configure DNS records
   - Add domain to hosting platform

2. **DNS Configuration**
   ```
   Type: CNAME
   Name: www
   Value: your-app.vercel.app
   
   Type: A
   Name: @
   Value: 76.76.19.19
   ```

## 📊 Monitoring & Analytics

### Application Monitoring

**Health Check Endpoint**
```javascript
// Add to server/app.js
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

**Error Monitoring**
```javascript
// Add error tracking service
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### Performance Monitoring

**Frontend Monitoring**
```javascript
// Add to client/src/main.jsx
import { Analytics } from '@vercel/analytics/react';

// In App component
<Analytics />
```

## 🚀 Deployment Scripts

### Automated Deployment

**package.json Scripts**
```json
{
  "scripts": {
    "build:prod": "npm run build --mode production",
    "deploy:frontend": "vercel --prod",
    "deploy:backend": "railway up",
    "deploy:all": "npm run deploy:backend && npm run deploy:frontend"
  }
}
```

**GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd server && npm install
      - run: cd server && npm test
      - run: cd server && npm run deploy

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd client && npm install
      - run: cd client && npm run build:prod
      - run: cd client && npm run deploy
```

## 🔄 Continuous Deployment

### GitHub Integration

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository to hosting platforms
   - Configure automatic deployments

2. **Branch Strategy**
   ```
   main: Production deployments
   develop: Development/testing
   feature/*: Feature branches
   ```

3. **Deployment Triggers**
   - Push to main: Auto-deploy to production
   - Pull request: Deploy to staging
   - Manual: Trigger deployment from dashboard

## 🧪 Post-Deployment Testing

### Health Checks

1. **API Health Check**
   ```bash
   curl https://your-backend-domain.com/api/health
   ```

2. **Frontend Load Test**
   ```bash
   curl https://your-frontend-domain.com
   ```

3. **Database Connection**
   ```bash
   # Test MongoDB connection
   # Check if seed data is loaded
   ```

### Functionality Tests

1. **User Registration/Login**
2. **Product Browsing**
3. **Cart Operations**
4. **Order Processing**
5. **Admin Functions**

### Performance Tests

1. **Page Load Times**
2. **API Response Times**
3. **Database Query Performance**
4. **File Upload Speed**

## 🔧 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables**
```bash
# Verify environment variables are set
echo $NODE_ENV
echo $MONGODB_URI

# Check in hosting platform dashboard
```

**CORS Issues**
```bash
# Verify CORS_ORIGIN is set correctly
# Check browser console for CORS errors
# Ensure frontend URL is in allowed origins
```

**Database Connection**
```bash
# Test MongoDB connection string
# Verify network access is configured
# Check database user credentials
```

### Logs and Debugging

**View Application Logs**
```bash
# Vercel
vercel logs

# Render
# Check dashboard logs

# Railway
railway logs
```

**Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm start

# Check specific modules
DEBUG=app:*,express:* npm start
```

## 📈 Scaling Considerations

### Performance Optimization

1. **Database Indexing**
   ```javascript
   // Add indexes for frequently queried fields
   db.products.createIndex({ "name": "text" });
   db.orders.createIndex({ "user": 1, "createdAt": -1 });
   ```

2. **Caching Strategy**
   ```javascript
   // Implement Redis caching
   const redis = require('redis');
   const client = redis.createClient();
   ```

3. **CDN Integration**
   - Use CDN for static assets
   - Configure image optimization
   - Enable gzip compression

### Load Balancing

1. **Multiple Instances**
   - Deploy multiple backend instances
   - Configure load balancer
   - Use session storage (Redis)

2. **Database Scaling**
   - MongoDB Atlas auto-scaling
   - Read replicas for queries
   - Connection pooling

---

**Deployment Guide Version**: 1.0  
**Last Updated**: December 2024 