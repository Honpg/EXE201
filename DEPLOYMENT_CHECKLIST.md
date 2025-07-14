# 🌊 Ocean AI - Complete Azure Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. **Dependencies Check**
- [x] Node.js 18+ 
- [x] Python 3.9+
- [x] Azure CLI installed
- [x] All package.json files valid
- [x] All requirements.txt valid

### 2. **Code Structure Ready**
- [x] Node Backend: Port 3000, Express server
- [x] AI Backend: Port 8000, Flask + Gunicorn
- [x] Frontend: React + Vite, production server ready
- [x] Chrome Extension: Environment detection configured

### 3. **Docker Support**
- [x] All Dockerfiles created and optimized
- [x] .dockerignore files added
- [x] Production-ready configurations

### 4. **Environment Configuration**
- [x] .env.example files created
- [x] Azure environment variables documented
- [x] CORS configuration for Azure domains

## 🚀 Deployment Options

### Option 1: Quick Deploy (Recommended for testing)
```powershell
.\quick-deploy-oceanai.ps1
```
**Deploys to:** Existing OceanAI app service
**Components:** Node Backend only
**Time:** ~5 minutes

### Option 2: Full Deployment
```bash
./deploy-azure.sh
# or PowerShell:
.\deploy-azure.ps1
```
**Deploys to:** 3 new app services
**Components:** All services (Node, AI, Frontend)
**Time:** ~15 minutes

### Option 3: Docker Container Deployment
```bash
# Build and push to Azure Container Registry
az acr create --resource-group EXE --name oceanairegistry --sku Basic
docker build -t oceanai-node ./node_backend
docker build -t oceanai-ai ./AI-backend
docker build -t oceanai-frontend ./Ocean-AI-frontend
```

## 📋 Post-Deployment Configuration

### 1. **Environment Variables (Required)**
Set in Azure Portal > App Services > Configuration:

#### Node Backend:
```
MONGO_URI=mongodb+srv://...
JWT_KEY=your-super-secret-key
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=https://oceanai-frontend.azurewebsites.net
AI_SERVER_URL=https://oceanai-backend.azurewebsites.net
```

#### AI Backend:
```
FLASK_ENV=production
FLASK_APP=app.py
PORT=8000
```

#### Frontend:
```
VITE_API_URL=https://oceanai.azurewebsites.net
```

### 2. **External Services Setup**

#### MongoDB Atlas:
- [x] Cluster created
- [x] Database user created
- [x] Network access configured (Azure IPs)
- [x] Connection string obtained

#### Google OAuth:
- [x] Project created in Google Cloud Console
- [x] OAuth consent screen configured
- [x] Credentials created (Client ID + Secret)
- [x] Authorized redirect URIs updated:
  - `https://oceanai.azurewebsites.net/api/oauth/google/callback`

#### Gmail App Password:
- [x] 2FA enabled on Gmail account
- [x] App password generated
- [x] Password stored securely

### 3. **Chrome Extension Configuration**
- [x] Update manifest.json permissions
- [x] Production URLs configured
- [x] Extension packaged (.crx)
- [x] Uploaded to Chrome Web Store (optional)

## 🧪 Testing Checklist

### Automated Tests:
```powershell
.\test-deployment.ps1
```

### Manual Tests:
- [ ] Node Backend health: `https://oceanai.azurewebsites.net/health`
- [ ] AI Backend health: `https://oceanai-backend.azurewebsites.net/health`
- [ ] Frontend loads: `https://oceanai-frontend.azurewebsites.net`
- [ ] Google OAuth login works
- [ ] Chrome extension connects to APIs
- [ ] End-to-end meeting workflow

## 🔧 Troubleshooting Guide

### Common Issues:

1. **502 Bad Gateway**
   - Check application logs in Azure Portal
   - Verify startup commands
   - Check environment variables

2. **CORS Errors**
   - Verify allowed origins in code
   - Check environment variables
   - Test with different browsers

3. **Database Connection**
   - Verify MongoDB Atlas network access
   - Check connection string format
   - Test connection manually

4. **OAuth Issues**
   - Check Google Cloud Console settings
   - Verify redirect URIs
   - Check client ID/secret

### Log Commands:
```bash
# View logs
az webapp log tail --resource-group EXE --name oceanai
az webapp log tail --resource-group EXE --name oceanai-backend
az webapp log tail --resource-group EXE --name oceanai-frontend

# Download logs
az webapp log download --resource-group EXE --name oceanai
```

## 📱 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Chrome Ext     │────│  Node Backend   │────│   AI Backend    │
│  (Extension)    │    │  (Port 3000)    │    │  (Port 8000)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐    ┌─────────────────┐
                       │  React Frontend │    │  MongoDB Atlas  │
                       │  (Port 80)      │    │  (Database)     │
                       └─────────────────┘    └─────────────────┘
```

## 🔐 Security Best Practices

- [x] Environment variables stored securely
- [x] JWT secrets are complex and unique
- [x] Database access restricted to Azure IPs
- [x] HTTPS enabled on all endpoints
- [x] CORS properly configured
- [x] App passwords used instead of regular passwords

## 📞 Support & Resources

- **Azure Portal:** https://portal.azure.com
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Google Cloud Console:** https://console.cloud.google.com
- **Chrome Developer Dashboard:** https://chrome.google.com/webstore/devconsole

---

**✨ Ready to Deploy!** Your Ocean AI application is fully configured for Azure deployment.
