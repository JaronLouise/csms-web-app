# Development Setup Guide

This guide will help you set up the CSMS web application development environment from scratch.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** (v18.0.0 or higher)
  ```bash
  # Check Node.js version
  node --version
  ```
- **npm** (v9.0.0 or higher)
  ```bash
  # Check npm version
  npm --version
  ```
- **Git** (for version control)
  ```bash
  # Check Git version
  git --version
  ```

### Recommended Software
- **VS Code** - Recommended code editor
- **MongoDB Compass** - Database GUI (optional)
- **Postman** - API testing tool (optional)

## 🚀 Initial Setup

### 1. Clone the Repository
```bash
# Clone the repository
git clone <repository-url>
cd csms-web-app

# Verify the structure
ls -la
```

### 2. Environment Configuration

#### Backend Environment Setup
```bash
# Navigate to server directory
cd server

# Copy environment template
cp env.production.example .env

# Edit the .env file with your configuration
nano .env
```

**Required Environment Variables for Backend:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/csms
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/csms

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email Configuration (for contact forms)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

#### Frontend Environment Setup
```bash
# Navigate to client directory
cd ../client

# Copy environment template
cp env.production.example .env

# Edit the .env file with your configuration
nano .env
```

**Required Environment Variables for Frontend:**
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Application Configuration
VITE_APP_NAME=CSMS
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### 3. Install Dependencies

#### Backend Dependencies
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

#### Frontend Dependencies
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

## 🗄️ Database Setup

### Local MongoDB Setup

#### Option 1: MongoDB Community Edition
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify MongoDB is running
sudo systemctl status mongodb
```

#### Option 2: MongoDB via Docker
```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest

# Verify container is running
docker ps
```

#### Option 3: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update your `MONGODB_URI` in the `.env` file

### Database Initialization
```bash
# Navigate to server directory
cd server

# Seed initial data (if available)
npm run seed

# Create admin user (if script exists)
node createAdmin.js
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Backend Server
```bash
# Navigate to server directory
cd server

# Start development server with nodemon
npm run dev

# Server should start on http://localhost:5000
```

#### Start Frontend Server
```bash
# Open new terminal
# Navigate to client directory
cd client

# Start development server
npm run dev

# Frontend should start on http://localhost:5173
```

### Production Mode

#### Build Frontend
```bash
# Navigate to client directory
cd client

# Build for production
npm run build

# Build files will be in dist/ directory
```

#### Start Production Server
```bash
# Navigate to server directory
cd server

# Start production server
npm start
```

## 🧪 Testing the Setup

### Backend API Testing
```bash
# Test server health
curl http://localhost:5000/api/health

# Test products endpoint
curl http://localhost:5000/api/products

# Test authentication endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Frontend Testing
1. Open browser to `http://localhost:5173`
2. Verify the application loads without errors
3. Test navigation between pages
4. Test user registration/login
5. Test product browsing

## 🔧 Development Tools Setup

### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### ESLint Configuration
The project includes ESLint configuration for code quality:
```bash
# Run linting on frontend
cd client
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Prettier Configuration
Ensure consistent code formatting:
```bash
# Install Prettier globally (optional)
npm install -g prettier

# Format code
prettier --write "src/**/*.{js,jsx,ts,tsx,css,md}"
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

#### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Restart MongoDB
sudo systemctl restart mongodb

# Check connection string in .env
echo $MONGODB_URI
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Loading
```bash
# Verify .env file exists
ls -la .env

# Check environment variables
node -e "console.log(process.env.NODE_ENV)"

# Restart development server
npm run dev
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Or set in .env
DEBUG=app:*,express:*
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Development Workflow
1. **Feature Development**: Create feature branches from `main`
2. **Code Review**: Submit pull requests for review
3. **Testing**: Ensure all tests pass before merging
4. **Documentation**: Update relevant documentation

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub/GitLab
```

---

**Setup Guide Version**: 1.0  
**Last Updated**: December 2024 