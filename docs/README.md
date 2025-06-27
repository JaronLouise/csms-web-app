# CSMS Web Application Documentation

Welcome to the CSMS (Customer Service Management System) web application documentation. This comprehensive guide will help developers understand the architecture, setup, and maintenance of the application.

## 📚 Documentation Index

### 🏗️ Architecture & Setup
- [Project Overview](./architecture/PROJECT_OVERVIEW.md) - High-level architecture and technology stack
- [Development Setup](./setup/DEVELOPMENT_SETUP.md) - How to set up the development environment
- [Deployment Guide](./deployment/DEPLOYMENT_GUIDE.md) - Production deployment instructions

### 🔧 Technical Documentation
- [API Documentation](./api/API_REFERENCE.md) - Complete API endpoints reference
- [Database Schema](./database/DATABASE_SCHEMA.md) - Database models and relationships
- [Authentication System](./auth/AUTHENTICATION.md) - User authentication and authorization
- [File Upload System](./uploads/FILE_UPLOAD.md) - Image and file handling

### 🎨 Frontend Documentation
- [React Components](./frontend/COMPONENTS.md) - Component structure and usage
- [State Management](./frontend/STATE_MANAGEMENT.md) - Context API and state handling
- [Routing System](./frontend/ROUTING.md) - React Router implementation
- [Styling Guide](./frontend/STYLING.md) - CSS and Tailwind usage

### 🔒 Security Documentation
- [Security Implementation](./security/SECURITY.md) - Security measures and best practices
- [Input Validation](./security/VALIDATION.md) - Data validation and sanitization
- [Rate Limiting](./security/RATE_LIMITING.md) - API rate limiting configuration

### 🧪 Testing & Quality
- [Testing Strategy](./testing/TESTING_STRATEGY.md) - Testing approach and guidelines
- [Code Quality](./quality/CODE_QUALITY.md) - Code standards and linting

### 📋 Maintenance & Operations
- [Troubleshooting](./maintenance/TROUBLESHOOTING.md) - Common issues and solutions
- [Performance Optimization](./maintenance/PERFORMANCE.md) - Performance best practices
- [Monitoring & Logging](./maintenance/MONITORING.md) - Application monitoring

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd csms-web-app
   ```

2. **Set up environment variables**
   - Copy `client/env.production.example` to `client/.env`
   - Copy `server/env.production.example` to `server/.env`
   - Fill in your configuration values

3. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

4. **Start development servers**
   ```bash
   # Start backend server (from server directory)
   npm run dev
   
   # Start frontend server (from client directory)
   npm run dev
   ```

## 📁 Project Structure

```
csms-web-app/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context providers
│   │   ├── services/      # API service functions
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                 # Node.js/Express backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/          # Configuration files
│   └── package.json
└── docs/                 # Documentation (this directory)
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Nodemailer** - Email functionality

### Security
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Input Validation** - Data sanitization

## 📞 Support

For questions or issues:
1. Check the [Troubleshooting Guide](./maintenance/TROUBLESHOOTING.md)
2. Review the [API Documentation](./api/API_REFERENCE.md)
3. Create an issue in the project repository

## 📝 Contributing

When contributing to this project:
1. Follow the [Code Quality Guidelines](./quality/CODE_QUALITY.md)
2. Update relevant documentation
3. Test your changes thoroughly
4. Follow the established coding standards

---

**Last Updated**: December 2024  
**Version**: 1.0.0 