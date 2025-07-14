# Azure Environment Variables Configuration Guide

## Node Backend (oceanai.azurewebsites.net)
Set these in Azure Portal > App Services > oceanai > Configuration > Application Settings:

NODE_ENV=production
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_KEY=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_here
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
CLIENT_URL=https://oceanai-frontend.azurewebsites.net
AI_SERVER_URL=https://oceanai-backend.azurewebsites.net
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

## AI Backend (oceanai-backend.azurewebsites.net)
Set these in Azure Portal > App Services > oceanai-backend > Configuration > Application Settings:

FLASK_ENV=production
FLASK_APP=app.py
PORT=8000

## Frontend (oceanai-frontend.azurewebsites.net)
Set these in Azure Portal > App Services > oceanai-frontend > Configuration > Application Settings:

VITE_API_URL=https://oceanai.azurewebsites.net

## Google OAuth Configuration
Update these URLs in Google Cloud Console:
- Authorized redirect URIs: https://oceanai.azurewebsites.net/api/oauth/google/callback
- Authorized JavaScript origins: https://oceanai-frontend.azurewebsites.net

## MongoDB Atlas Configuration
- Whitelist Azure IPs or use 0.0.0.0/0 (not recommended for production)
- Create a dedicated database user for the application

## Gmail App Password
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for the application
3. Use this App Password as EMAIL_PASS (not your regular password)
