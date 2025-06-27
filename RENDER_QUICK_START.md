# ⚡ Render.com Quick Start Checklist

## 🚀 Essential Steps (5 minutes)

### 1. Sign Up & Connect
- [ ] Go to [render.com](https://render.com)
- [ ] Sign up with GitHub
- [ ] Connect your CSMS repository

### 2. Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Select your repository
- [ ] Set **Root Directory**: `server` ⭐
- [ ] Set **Build Command**: `npm install`
- [ ] Set **Start Command**: `npm start`

### 3. Add Environment Variables
**Click "Advanced" → Add these variables:**

```
NODE_ENV = production
PORT = 5000
JWT_SECRET = your-jwt-secret-key
MONGODB_URI = your-mongodb-connection-string
BREVO_USER = your-brevo-email
BREVO_PASSWORD = your-brevo-password
SUPABASE_URL = your-supabase-url
SUPABASE_ANON_KEY = your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-supabase-service-key
CORS_ORIGIN = https://your-frontend-url.vercel.app
```

### 4. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes
- [ ] Copy your URL: `https://your-service.onrender.com`

### 5. Test
```bash
curl https://your-service.onrender.com/api/products
```

## 🎯 Key Configuration Points

| Setting | Value | Why? |
|---------|-------|------|
| **Root Directory** | `server` | Your Node.js code is in server folder |
| **Build Command** | `npm install` | Installs dependencies |
| **Start Command** | `npm start` | Runs your server |
| **Instance Type** | Free/Starter | Free for testing, $7/month for production |

## 🚨 Common Issues

**Build Fails?**
- Check `package.json` has `"start": "node server.js"`
- Verify all dependencies are listed

**Database Connection Fails?**
- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas network access

**CORS Errors?**
- Update `CORS_ORIGIN` with your frontend URL
- Redeploy after frontend deployment

## 📞 Need Help?

1. Check the full guide: `RENDER_DEPLOYMENT_GUIDE.md`
2. Look at Render logs in dashboard
3. Test locally first: `npm start`

---
**Next Step**: Deploy frontend to Vercel, then update CORS_ORIGIN 