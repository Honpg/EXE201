# Ocean AI Azure Deployment Script (PowerShell)
Write-Host "🌊 Starting Ocean AI Deployment to Azure..." -ForegroundColor Cyan

# Configuration
$RESOURCE_GROUP = "EXE"
$LOCATION = "Southeast Asia"
$NODE_BACKEND_APP = "oceanai"
$AI_BACKEND_APP = "oceanai-backend"
$FRONTEND_APP = "oceanai-frontend"

# Create resource group if it doesn't exist
Write-Host "📁 Creating resource group..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service Plans
Write-Host "📋 Creating App Service Plans..." -ForegroundColor Yellow
az appservice plan create `
  --name "oceanai-plan" `
  --resource-group $RESOURCE_GROUP `
  --sku B1 `
  --is-linux

# Deploy Node Backend
Write-Host "🚀 Deploying Node Backend..." -ForegroundColor Green
Set-Location node_backend
Compress-Archive -Path * -DestinationPath ..\node-backend.zip -Force -Exclude node_modules,.env,*.log
Set-Location ..

az webapp create `
  --resource-group $RESOURCE_GROUP `
  --plan oceanai-plan `
  --name $NODE_BACKEND_APP `
  --runtime "NODE|20-lts"

az webapp deployment source config-zip `
  --resource-group $RESOURCE_GROUP `
  --name $NODE_BACKEND_APP `
  --src node-backend.zip

# Deploy AI Backend
Write-Host "🤖 Deploying AI Backend..." -ForegroundColor Green
Set-Location AI-backend
Compress-Archive -Path * -DestinationPath ..\ai-backend.zip -Force -Exclude __pycache__,.env,*.log,reports
Set-Location ..

az webapp create `
  --resource-group $RESOURCE_GROUP `
  --plan oceanai-plan `
  --name $AI_BACKEND_APP `
  --runtime "PYTHON|3.9"

az webapp deployment source config-zip `
  --resource-group $RESOURCE_GROUP `
  --name $AI_BACKEND_APP `
  --src ai-backend.zip

# Deploy Frontend
Write-Host "🎨 Building and Deploying Frontend..." -ForegroundColor Green
Set-Location Ocean-AI-frontend

# Install Express for production server
npm install express --save

# Build the React app
npm install
npm run build

# Create deployment package
Compress-Archive -Path * -DestinationPath ..\frontend.zip -Force -Exclude node_modules\.cache,src,public,.env*,*.md
Set-Location ..

az webapp create `
  --resource-group $RESOURCE_GROUP `
  --plan oceanai-plan `
  --name $FRONTEND_APP `
  --runtime "NODE|20-lts"

az webapp deployment source config-zip `
  --resource-group $RESOURCE_GROUP `
  --name $FRONTEND_APP `
  --src frontend.zip

# Set startup command for frontend
az webapp config set `
  --resource-group $RESOURCE_GROUP `
  --name $FRONTEND_APP `
  --startup-file "node server.js"

# Configure Environment Variables
Write-Host "⚙️ Configuring Environment Variables..." -ForegroundColor Yellow

# Node Backend Environment Variables
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $NODE_BACKEND_APP `
  --settings `
    NODE_ENV=production `
    AI_SERVER_URL=https://$AI_BACKEND_APP.azurewebsites.net `
    CLIENT_URL=https://$FRONTEND_APP.azurewebsites.net

# AI Backend Environment Variables
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $AI_BACKEND_APP `
  --settings `
    FLASK_ENV=production `
    FLASK_APP=app.py

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your applications are available at:" -ForegroundColor Cyan
Write-Host "   • Frontend: https://$FRONTEND_APP.azurewebsites.net" -ForegroundColor White
Write-Host "   • Node Backend: https://$NODE_BACKEND_APP.azurewebsites.net" -ForegroundColor White
Write-Host "   • AI Backend: https://$AI_BACKEND_APP.azurewebsites.net" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Don't forget to:" -ForegroundColor Yellow
Write-Host "   1. Configure your database connection strings" -ForegroundColor White
Write-Host "   2. Set up your Google OAuth credentials" -ForegroundColor White
Write-Host "   3. Configure email settings" -ForegroundColor White
Write-Host "   4. Update Chrome extension with production URLs" -ForegroundColor White
