# 🚀 Vercel Frontend Deployment Guide

## Overview
This guide will walk you through deploying your CSMS frontend (React + Vite) to Vercel.com.

## Prerequisites
- ✅ Backend deployed to Render.com (✅ DONE!)
- ✅ Backend URL: `https://resetcorp.onrender.com`
- ✅ GitHub repository with your code

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] Your frontend code is in the `client` folder
- [ ] `package.json` has build script: `"build": "vite build"`
- [ ] API configuration uses environment variables
- [ ] All dependencies are installed

---

## 🚀 Step-by-Step Vercel Deployment

### Step 1: Sign Up for Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Sign Up"**
3. **Sign up with GitHub** (recommended)
4. **Verify your email** if required

### Step 2: Import Your Project

1. **In your Vercel dashboard, click "New Project"**
2. **Import Git Repository:**
   - Select your CSMS repository from the list
   - Click "Import"

### Step 3: Configure Your Project

Fill in the configuration form:

#### **Basic Settings:**
- **Project Name**: `csms-frontend` (or any name you prefer)
- **Framework Preset**: `Vite` ⭐ **IMPORTANT**
- **Root Directory**: `client` ⭐ **IMPORTANT**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### **Environment Variables:**
Click "Environment Variables" and add:
```
VITE_API_URL = https://resetcorp.onrender.com/api
```

### Step 4: Deploy Your Project

1. **Click "Deploy"**
2. **Wait for deployment** (2-3 minutes)
3. **Watch the build logs** for any errors
4. **Copy your project URL** when deployment completes

### Step 5: Test Your Deployment

#### **Test Frontend:**
1. Visit your Vercel URL
2. Test user registration/login
3. Test product browsing
4. Test all major features

#### **Test API Connection:**
Open browser DevTools → Console and run:
```javascript
fetch('https://resetcorp.onrender.com/api/products')
  .then(response => response.json())
  .then(data => console.log('API working!', data))
  .catch(error => console.error('API error:', error));
```

---

## 🔧 Configuration Details

### **Framework Preset: Vite**
Vercel automatically detects Vite and configures:
- Build command: `npm run build`
- Output directory: `dist`
- Development server: `npm run dev`

### **Root Directory: `client`**
This tells Vercel where your React code is located.

### **Environment Variables**
Only frontend environment variables (starting with `VITE_`) need to be added to Vercel.

---

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. Build Fails**
**Error**: "Build failed"
**Solution**: 
- Check your `package.json` has correct build script
- Verify all dependencies are listed
- Check build logs for specific errors

#### **2. API Connection Fails**
**Error**: "Failed to fetch"
**Solution**:
- Verify `VITE_API_URL` is set correctly
- Check if backend is running
- Test API directly: `curl https://resetcorp.onrender.com/api/products`

#### **3. CORS Errors**
**Error**: "CORS policy blocked"
**Solution**:
- Update backend CORS_ORIGIN with your Vercel URL
- Redeploy backend
- Check CORS configuration

#### **4. Environment Variables Not Working**
**Error**: "VITE_API_URL is undefined"
**Solution**:
- Add environment variable to Vercel
- Redeploy the project
- Check variable name starts with `VITE_`

### **Debug Steps:**
1. **Check Build Logs**: Look at Vercel build logs for errors
2. **Test Locally**: Run `npm run build` locally to verify
3. **Check Environment**: Verify environment variables are set
4. **Test API**: Use browser console to test API calls

---

## 📊 Monitoring Your Project

### **Vercel Dashboard Features:**
- **Deployments**: History of all deployments
- **Analytics**: Page views, performance metrics
- **Functions**: Serverless functions (if used)
- **Settings**: Domain, environment variables

### **Automatic Deployments:**
- Push to your selected branch
- Vercel automatically redeploys
- Preview deployments for pull requests

---

## 🔄 Updating Your Project

### **Automatic Deployments:**
- Push to your selected branch
- Vercel automatically redeploys
- No manual intervention needed

### **Manual Deployments:**
1. Go to your project dashboard
2. Click "Redeploy"
3. Select branch to deploy from
4. Click "Redeploy"

### **Environment Variable Updates:**
1. Go to "Settings" → "Environment Variables"
2. Add/modify variables
3. Click "Save"
4. Redeploy project

---

## 💰 Pricing

### **Free Tier:**
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ HTTPS/SSL
- ✅ CDN
- ✅ Perfect for production

### **Pro Plan ($20/month):**
- ✅ Team collaboration
- ✅ Advanced analytics
- ✅ More bandwidth
- ✅ Priority support

---

## 🎉 Success Checklist

After deployment, verify:
- [ ] Project is deployed (green status)
- [ ] Frontend loads correctly
- [ ] API calls work (no CORS errors)
- [ ] User registration/login works
- [ ] Product browsing works
- [ ] All major features function

---

## 📞 Next Steps

1. **Test your frontend thoroughly**
2. **Update backend CORS_ORIGIN** with your Vercel URL
3. **Test full application**
4. **Set up custom domain (optional)**
5. **Configure analytics (optional)**

---

## 🆘 Support

If you encounter issues:
1. Check this troubleshooting section
2. Review Vercel documentation
3. Check your build logs
4. Verify environment variables are set correctly

**Vercel Support**: Available in their dashboard and documentation 