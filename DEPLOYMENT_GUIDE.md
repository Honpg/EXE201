# Ocean AI Azure Deployment Guide

## 🌊 Overview
This guide helps you deploy Ocean AI to Azure App Services with minimal configuration.

## 📋 Prerequisites
1. Azure CLI installed and logged in
2. Node.js 18+ installed
3. Python 3.9+ installed
4. Git repository access

## 🚀 Quick Deployment

### Option 1: Deploy to Existing OceanAI App Service
```powershell
.\quick-deploy-oceanai.ps1
```

### Option 2: Full Deployment (New Resources)
```powershell
.\deploy-azure.ps1
```

## 🔧 Manual Configuration Steps

### 1. Environment Variables
Configure these in Azure Portal:

#### Node Backend (oceanai.azurewebsites.net)
```
NODE_ENV=production
MONGO_URI=your_mongodb_connection
JWT_KEY=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=https://oceanai-frontend.azurewebsites.net
AI_SERVER_URL=https://oceanai-backend.azurewebsites.net
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 2. Database Setup
- Create MongoDB Atlas cluster
- Whitelist Azure IPs
- Update MONGO_URI in environment variables

### 3. Google OAuth Setup
- Update redirect URIs in Google Console:
  - `https://oceanai.azurewebsites.net/api/oauth/google/callback`

### 4. Chrome Extension
- Update `config.js` with production URLs
- Package and upload to Chrome Web Store

## 🧪 Testing Your Deployment

### Test Node Backend
```bash
curl https://oceanai.azurewebsites.net/health
```

### Test AI Backend
```bash
curl https://oceanai-backend.azurewebsites.net/health
```

### Test Frontend
Visit: https://oceanai-frontend.azurewebsites.net

## 🔍 Troubleshooting

### Common Issues
1. **502 Bad Gateway**: Check logs in Azure Portal
2. **CORS Errors**: Verify origin settings in code
3. **Environment Variables**: Double-check in Azure Portal
4. **Database Connection**: Verify MongoDB Atlas whitelist

### View Logs
```bash
az webapp log tail --resource-group EXE --name oceanai
```

## 📱 Architecture

```
Chrome Extension → Node Backend (Port 3000) → AI Backend (Port 8000)
                ↓
              React Frontend (Port 80)
                ↓
              MongoDB Atlas
```

## 🔐 Security Checklist
- [ ] Environment variables set correctly
- [ ] MongoDB Atlas IP whitelist configured
- [ ] CORS origins properly configured
- [ ] JWT secrets are secure
- [ ] Gmail app passwords used (not regular passwords)

## 📞 Support
If you encounter issues:
1. Check Azure App Service logs
2. Verify environment variables
3. Test API endpoints individually
4. Check database connectivity
