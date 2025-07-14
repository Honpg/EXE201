#!/bin/bash

# Ocean AI Azure Deployment Script
echo "🌊 Starting Ocean AI Deployment to Azure..."

# Configuration
RESOURCE_GROUP="EXE"
LOCATION="Southeast Asia"
NODE_BACKEND_APP="oceanai"
AI_BACKEND_APP="oceanai-backend"
FRONTEND_APP="oceanai-frontend"

# Create resource group if it doesn't exist
echo "📁 Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create App Service Plans
echo "📋 Creating App Service Plans..."
az appservice plan create \
  --name "oceanai-plan" \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Deploy Node Backend
echo "🚀 Deploying Node Backend..."
cd node_backend
zip -r ../node-backend.zip . -x "node_modules/*" ".env" "*.log"
cd ..

az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan oceanai-plan \
  --name $NODE_BACKEND_APP \
  --runtime "NODE|20-lts"

az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $NODE_BACKEND_APP \
  --src node-backend.zip

# Deploy AI Backend
echo "🤖 Deploying AI Backend..."
cd AI-backend
zip -r ../ai-backend.zip . -x "__pycache__/*" ".env" "*.log" "reports/*"
cd ..

az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan oceanai-plan \
  --name $AI_BACKEND_APP \
  --runtime "PYTHON|3.9"

az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $AI_BACKEND_APP \
  --src ai-backend.zip

# Deploy Frontend
echo "🎨 Deploying Frontend..."
cd Ocean-AI-frontend

# Install Express for production server
npm install express --save

# Build the React app
npm install
npm run build

# Create deployment package
zip -r ../frontend.zip . -x "node_modules/.cache/*" "src/*" "public/*" ".env*" "*.md"
cd ..

az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan oceanai-plan \
  --name $FRONTEND_APP \
  --runtime "NODE|20-lts"

az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP \
  --src frontend.zip

# Set startup command for frontend
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP \
  --startup-file "node server.js"

# Configure Environment Variables
echo "⚙️ Configuring Environment Variables..."

# Node Backend Environment Variables
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $NODE_BACKEND_APP \
  --settings \
    NODE_ENV=production \
    AI_SERVER_URL=https://$AI_BACKEND_APP.azurewebsites.net \
    CLIENT_URL=https://$FRONTEND_APP.azurewebsites.net

# AI Backend Environment Variables
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $AI_BACKEND_APP \
  --settings \
    FLASK_ENV=production \
    FLASK_APP=app.py

# Frontend Environment Variables
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP \
  --settings \
    VITE_API_URL=https://$NODE_BACKEND_APP.azurewebsites.net

echo "✅ Deployment completed!"
echo "🌐 Your applications are available at:"
echo "   • Frontend: https://$FRONTEND_APP.azurewebsites.net"
echo "   • Node Backend: https://$NODE_BACKEND_APP.azurewebsites.net"
echo "   • AI Backend: https://$AI_BACKEND_APP.azurewebsites.net"
echo ""
echo "🔧 Don't forget to:"
echo "   1. Configure your database connection strings"
echo "   2. Set up your Google OAuth credentials"
echo "   3. Configure email settings"
echo "   4. Update Chrome extension with production URLs"
