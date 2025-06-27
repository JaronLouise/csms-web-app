# Quick Start Guide for New Developers

Welcome to the CSMS web application! This guide will help you get up and running quickly.

## 🚀 Prerequisites

Before you start, make sure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Git**
- **MongoDB Atlas account** (free tier works fine)
- **Code editor** (VS Code recommended)

## ⚡ Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd csms-web-app

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Setup

```bash
# Backend environment
cd server
cp env.production.example .env

# Edit .env with your values
nano .env
```

**Required Backend Variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/csms
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CORS_ORIGIN=http://localhost:5173
```

```bash
# Frontend environment
cd ../client
cp env.production.example .env

# Edit .env
nano .env
```

**Required Frontend Variables:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CSMS
```

### 3. Database Setup

1. **Create MongoDB Atlas Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free cluster
   - Get connection string
   - Add to `MONGODB_URI` in backend `.env`

2. **Seed Initial Data**
   ```bash
   cd server
   npm run seed
   ```

### 4. Start Development Servers

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

### 5. Verify Setup

- **Backend**: http://localhost:5000/api/health
- **Frontend**: http://localhost:5173
- **Database**: Check MongoDB Atlas dashboard

## 🎯 First Steps

### 1. Explore the Codebase

**Key Directories:**
```
csms-web-app/
├── client/src/          # React frontend
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── context/        # State management
│   └── services/       # API calls
├── server/             # Node.js backend
│   ├── controllers/    # Route handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── middleware/     # Custom middleware
└── docs/              # Documentation
```

### 2. Create Your First Feature

**Example: Add a new product field**

1. **Update Database Model** (`server/models/Product.js`)
   ```javascript
   // Add new field
   brand: {
     type: String,
     required: false
   }
   ```

2. **Update API** (`server/controllers/productController.js`)
   ```javascript
   // Include brand in create/update logic
   ```

3. **Update Frontend** (`client/src/components/ProductCard.jsx`)
   ```jsx
   // Display brand information
   <div className="product-brand">{product.brand}</div>
   ```

### 3. Test Your Changes

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 🔧 Common Development Tasks

### Adding a New API Endpoint

1. **Create Route** (`server/routes/newRoute.js`)
   ```javascript
   const express = require('express');
   const router = express.Router();
   const { protect } = require('../middleware/auth');
   
   router.get('/', protect, async (req, res) => {
     // Your logic here
   });
   
   module.exports = router;
   ```

2. **Register Route** (`server/app.js`)
   ```javascript
   const newRoutes = require('./routes/newRoute');
   app.use('/api/new', newRoutes);
   ```

3. **Create Service** (`client/src/services/newService.js`)
   ```javascript
   import api from './api';
   
   export const getNewData = () => api.get('/new');
   ```

### Adding a New React Component

1. **Create Component** (`client/src/components/NewComponent.jsx`)
   ```jsx
   import React from 'react';
   
   const NewComponent = ({ data }) => {
     return (
       <div className="new-component">
         {data}
       </div>
     );
   };
   
   export default NewComponent;
   ```

2. **Use Component** (in any page)
   ```jsx
   import NewComponent from '../components/NewComponent';
   
   // In your component
   <NewComponent data="Hello World" />
   ```

### Database Operations

**Create New Model** (`server/models/NewModel.js`)
```javascript
const mongoose = require('mongoose');

const newModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NewModel', newModelSchema);
```

**Create Controller** (`server/controllers/newController.js`)
```javascript
const NewModel = require('../models/NewModel');

exports.create = async (req, res) => {
  try {
    const newItem = await NewModel.create(req.body);
    res.status(201).json({
      success: true,
      data: newItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
```

## 🐛 Debugging Tips

### Backend Debugging

```javascript
// Add debugging logs
console.log('Request body:', req.body);
console.log('User:', req.user);

// Use debug mode
DEBUG=* npm run dev
```

### Frontend Debugging

```jsx
// Add React debugging
console.log('Component state:', state);
console.log('Props:', props);

// Use React DevTools browser extension
```

### Database Debugging

```javascript
// Enable Mongoose debugging
mongoose.set('debug', true);

// Check database connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
```

## 📚 Learning Resources

### Essential Concepts

1. **React Hooks**
   - `useState` - State management
   - `useEffect` - Side effects
   - `useContext` - Global state

2. **Express.js**
   - Middleware
   - Route handling
   - Error handling

3. **MongoDB/Mongoose**
   - Schema definition
   - CRUD operations
   - Relationships

### Recommended Reading

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## 🤝 Contributing

### Code Standards

1. **JavaScript/React**
   - Use ES6+ features
   - Prefer functional components
   - Use meaningful variable names

2. **File Organization**
   - Keep components small and focused
   - Use consistent file naming
   - Group related files together

3. **Git Workflow**
   ```bash
   # Create feature branch
   git checkout -b feature/new-feature
   
   # Make changes and commit
   git add .
   git commit -m "feat: add new feature"
   
   # Push and create PR
   git push origin feature/new-feature
   ```

### Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- ProductCard.test.js

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Quick Deploy to Vercel (Frontend)

```bash
cd client
npm install -g vercel
vercel login
vercel --prod
```

### Quick Deploy to Render (Backend)

1. Connect GitHub repository to Render
2. Set environment variables
3. Deploy automatically

## 📞 Getting Help

### When You're Stuck

1. **Check the logs**
   ```bash
   # Backend logs
   npm run dev
   
   # Frontend logs
   npm run dev
   ```

2. **Search existing issues**
   - Check GitHub issues
   - Search documentation

3. **Ask for help**
   - Create detailed issue
   - Include error messages
   - Describe what you tried

### Useful Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Update dependencies
npm update

# Check for security issues
npm audit
npm audit fix
```

## 🎉 You're Ready!

You now have a working development environment for the CSMS application. Start exploring the codebase and building features!

**Next Steps:**
1. Read the [full documentation](./README.md)
2. Explore the [API reference](./api/API_REFERENCE.md)
3. Check out the [component documentation](./frontend/COMPONENTS.md)
4. Review the [security guidelines](./security/SECURITY.md)

Happy coding! 🚀

---

**Quick Start Guide Version**: 1.0  
**Last Updated**: December 2024 