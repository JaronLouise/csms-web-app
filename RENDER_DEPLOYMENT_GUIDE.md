# 🚀 Render.com Backend Deployment Guide

## Overview
This guide will walk you through deploying your CSMS backend (Node.js + Express) to Render.com.

## Prerequisites
- ✅ GitHub repository with your code
- ✅ MongoDB Atlas database (already configured)
- ✅ Supabase project (already configured)
- ✅ Brevo email service (already configured)
- ✅ Your `.env` file with all credentials

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] Your backend code is in the `server` folder
- [ ] `package.json` has correct start script: `"start": "node server.js"`
- [ ] CORS configuration is updated for production
- [ ] All environment variables are documented

### ✅ Environment Variables Ready
Make sure you have these values ready:
- MongoDB Atlas connection string
- JWT secret key
- Brevo email credentials
- Supabase credentials
- CORS origin (will be set after frontend deployment)

---

## 🚀 Step-by-Step Render Deployment

### Step 1: Sign Up for Render.com

1. **Go to [render.com](https://render.com)**
2. **Click "Get Started"**
3. **Sign up with GitHub** (recommended) or email
4. **Verify your email** if required

### Step 2: Create New Web Service

1. **In your Render dashboard, click "New +"**
2. **Select "Web Service"**
3. **Connect your GitHub repository:**
   - Click "Connect account" if not connected
   - Select your CSMS repository from the list
   - Click "Connect"

### Step 3: Configure Your Service

Fill in the configuration form:

#### **Basic Settings:**
- **Name**: `csms-backend` (or any name you prefer)
- **Region**: Choose closest to your users (US East, US West, etc.)
- **Branch**: `main` (or your preferred branch)
- **Root Directory**: `server` ⭐ **IMPORTANT**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### **Advanced Settings:**
- **Instance Type**: `Free` (for testing) or `Starter` ($7/month for production)
- **Auto-Deploy**: ✅ **Enabled** (deploys automatically when you push to GitHub)

### Step 4: Add Environment Variables

**Click "Advanced" → "Add Environment Variable"**

Add these variables one by one:

#### **Server Configuration:**
```
NODE_ENV = production
PORT = 5000
```

#### **CORS Configuration:**
```
CORS_ORIGIN = https://your-frontend-url.vercel.app
```
*Note: You'll update this after deploying your frontend*

#### **JWT Configuration:**
```
JWT_SECRET = your-super-secure-jwt-secret-key-here
```
*Use a strong, random string (at least 32 characters)*

#### **Database Configuration:**
```
MONGODB_URI = your-mongodb-atlas-connection-string
```
*Format: mongodb+srv://username:password@cluster.mongodb.net/database*

#### **Email Configuration (Brevo):**
```
BREVO_USER = your-brevo-email@example.com
BREVO_PASSWORD = your-brevo-password
```

#### **Supabase Configuration:**
```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-supabase-service-role-key
```

#### **Optional: Resend Email (Alternative to Brevo):**
```
RESEND_API_KEY = your-resend-api-key
```

### Step 5: Deploy Your Service

1. **Click "Create Web Service"**
2. **Wait for deployment** (5-10 minutes)
3. **Watch the build logs** for any errors
4. **Copy your service URL** when deployment completes

### Step 6: Test Your Deployment

#### **Test API Endpoints:**
```bash
# Test basic connectivity
curl https://your-service-name.onrender.com/api/products

# Test with authentication
curl -H "Authorization: Bearer your-token" \
     https://your-service-name.onrender.com/api/admin/products
```

#### **Check Logs:**
1. Go to your service dashboard
2. Click "Logs" tab
3. Look for any error messages
4. Verify database connection success

---

## 🔧 Configuration Details

### **Root Directory: `server`**
This tells Render where your Node.js code is located.

### **Build Command: `npm install`**
Installs all dependencies from `package.json`.

### **Start Command: `npm start`**
Runs your server using the script in `package.json`.

### **Environment Variables**
All your `.env` variables need to be added to Render's environment variables section.

---

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. Build Fails**
**Error**: "Build failed"
**Solution**: 
- Check your `package.json` has correct scripts
- Verify all dependencies are listed
- Check build logs for specific errors

#### **2. Database Connection Fails**
**Error**: "MongoDB connection failed"
**Solution**:
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access
- Ensure database user has correct permissions

#### **3. CORS Errors**
**Error**: "CORS policy blocked"
**Solution**:
- Update `CORS_ORIGIN` with your frontend URL
- Redeploy the service
- Check CORS configuration in `app.js`

#### **4. Environment Variables Missing**
**Error**: "process.env.VARIABLE is undefined"
**Solution**:
- Add missing environment variable to Render
- Redeploy the service
- Check variable names match exactly

#### **5. Port Issues**
**Error**: "Port already in use"
**Solution**:
- Render automatically sets `PORT` environment variable
- Your code should use `process.env.PORT || 5000`

### **Debug Steps:**
1. **Check Logs**: Go to "Logs" tab in Render dashboard
2. **Test Locally**: Run `npm start` locally to verify code works
3. **Verify Environment**: Check all environment variables are set
4. **Test API**: Use Postman or curl to test endpoints

---

## 📊 Monitoring Your Service

### **Render Dashboard Features:**
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory usage
- **Deployments**: History of all deployments
- **Environment**: Manage environment variables

### **Health Checks:**
Render automatically checks if your service is responding:
- **Health Check Path**: `/` (your root endpoint)
- **Timeout**: 30 seconds
- **Interval**: 30 seconds

---

## 🔄 Updating Your Service

### **Automatic Deployments:**
- Push to your selected branch
- Render automatically redeploys
- No manual intervention needed

### **Manual Deployments:**
1. Go to your service dashboard
2. Click "Manual Deploy"
3. Select branch to deploy from
4. Click "Deploy"

### **Environment Variable Updates:**
1. Go to "Environment" tab
2. Add/modify variables
3. Click "Save Changes"
4. Service automatically redeploys

---

## 💰 Pricing

### **Free Tier:**
- ✅ 750 hours/month
- ✅ 512MB RAM
- ✅ Shared CPU
- ✅ Perfect for testing

### **Starter Plan ($7/month):**
- ✅ 750 hours/month
- ✅ 512MB RAM
- ✅ Dedicated CPU
- ✅ Better performance
- ✅ Recommended for production

---

## 🎉 Success Checklist

After deployment, verify:
- [ ] Service is running (green status)
- [ ] API endpoints respond correctly
- [ ] Database connection works
- [ ] File uploads work (Supabase)
- [ ] Email sending works (Brevo)
- [ ] Authentication works (JWT)
- [ ] CORS is configured (after frontend deployment)

---

## 📞 Next Steps

1. **Test your backend thoroughly**
2. **Deploy frontend to Vercel**
3. **Update CORS_ORIGIN with frontend URL**
4. **Test full application**
5. **Set up custom domain (optional)**

---

## 🆘 Support

If you encounter issues:
1. Check this troubleshooting section
2. Review Render.com documentation
3. Check your application logs
4. Verify all environment variables are set correctly

**Render.com Support**: Available in their dashboard and documentation 