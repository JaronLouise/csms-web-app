# 🚀 CSMS Web App Deployment Guide

## Overview
This guide will help you deploy your CSMS (Customer Service Management System) web app to the internet for public viewing.

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **File Storage**: Supabase
- **Email Service**: Brevo
- **Authentication**: JWT

## 🎯 Recommended Deployment: Render.com
**Total Cost: ~$7/month**

### Phase 1: Database Setup (Free)
1. **MongoDB Atlas** (Already configured)
   - Your existing MongoDB Atlas cluster is ready
   - No additional setup needed

### Phase 2: Backend Deployment (Render.com - $7/month)
1. **Sign up for Render.com**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure environment variables**
5. **Deploy**

### Phase 3: Frontend Deployment (Vercel - Free)
1. **Sign up for Vercel.com**
2. **Import your GitHub repository**
3. **Configure build settings**
4. **Set environment variables**
5. **Deploy**

## 📋 Pre-Deployment Checklist

### ✅ Backend Preparation
- [ ] Environment variables configured
- [ ] CORS settings updated for production
- [ ] Database connection tested
- [ ] File uploads working with Supabase
- [ ] Email service (Brevo) configured

### ✅ Frontend Preparation
- [ ] API base URL configured for production
- [ ] Build process tested locally
- [ ] Environment variables set up

## 🔧 Environment Variables Setup

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-url.vercel.app
JWT_SECRET=your-super-secure-jwt-secret-key-here
MONGODB_URI=your-mongodb-atlas-connection-string
BREVO_USER=your-brevo-email
BREVO_PASSWORD=your-brevo-password
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## 🚀 Step-by-Step Deployment

### Step 1: Backend Deployment (Render.com)
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: csms-backend
   - **Root Directory**: server
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables (copy from your .env file)
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy the generated URL (e.g., `https://csms-backend.onrender.com`)

### Step 2: Frontend Deployment (Vercel)
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
5. Add environment variable:
   - **VITE_API_URL**: `https://your-backend-url.onrender.com/api`
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Copy the generated URL (e.g., `https://csms-frontend.vercel.app`)

### Step 3: Update CORS Settings
1. Go back to Render.com dashboard
2. Find your backend service
3. Go to "Environment" tab
4. Update `CORS_ORIGIN` to your frontend URL
5. Redeploy the service

### Step 4: Test Your Deployment
1. Visit your frontend URL
2. Test user registration/login
3. Test product creation/upload
4. Test email functionality
5. Test all major features

## 🔍 Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure CORS_ORIGIN is set correctly
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **File Uploads**: Check Supabase configuration
4. **Email Service**: Verify Brevo credentials

### Debug Steps:
1. Check Render.com logs for backend errors
2. Check Vercel build logs for frontend errors
3. Test API endpoints directly using Postman
4. Verify environment variables are set correctly

## 💰 Cost Breakdown
- **Render.com Backend**: $7/month
- **Vercel Frontend**: Free
- **MongoDB Atlas**: Free tier
- **Supabase**: Free tier
- **Brevo**: Free tier (300 emails/day)
- **Total**: ~$7/month

## 🎉 Success!
Once deployed, your CSMS web app will be:
- ✅ Publicly accessible on the internet
- ✅ Searchable by search engines
- ✅ Secure with HTTPS
- ✅ Scalable and reliable

## 📞 Support
If you encounter issues during deployment:
1. Check the troubleshooting section above
2. Review Render.com and Vercel documentation
3. Check your application logs for specific error messages 