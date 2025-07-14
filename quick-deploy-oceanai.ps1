# Quick Deploy to Existing OceanAI App Service
Write-Host "🌊 Quick Deploy to OceanAI App Service..." -ForegroundColor Cyan

$RESOURCE_GROUP = "EXE"
$APP_NAME = "OceanAI"

# Build and deploy Node Backend to existing OceanAI
Write-Host "🚀 Deploying Node Backend to OceanAI..." -ForegroundColor Green

# Create deployment package
Set-Location node_backend
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
Compress-Archive -Path * -DestinationPath ..\oceanai-deploy.zip -Force -Exclude node_modules,.env,*.log,screenshots

Set-Location ..

# Deploy to Azure
Write-Host "🚀 Uploading to Azure..." -ForegroundColor Yellow
az webapp deployment source config-zip `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --src oceanai-deploy.zip

# Set startup command to use Node.js properly
Write-Host "⚙️ Configuring runtime..." -ForegroundColor Yellow
az webapp config set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --startup-file "node index.js"

# Set basic environment variables
Write-Host "⚙️ Setting basic environment variables..." -ForegroundColor Yellow
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --settings `
    NODE_ENV=production `
    SCM_DO_BUILD_DURING_DEPLOYMENT=true `
    WEBSITE_NODE_DEFAULT_VERSION=20.11.0 `
    PORT=3000

Write-Host "✅ Deployment to OceanAI completed!" -ForegroundColor Green
Write-Host "🌐 Your app is available at: https://oceanai.azurewebsites.net" -ForegroundColor Cyan
Write-Host "🔍 Health check: https://oceanai.azurewebsites.net/health" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Go to Azure Portal > App Services > OceanAI > Configuration" -ForegroundColor White
Write-Host "   2. Add your environment variables (MONGO_URI, JWT_KEY, etc.)" -ForegroundColor White
Write-Host "   3. Test the API endpoints" -ForegroundColor White
Write-Host "   4. Update Chrome extension URLs if needed" -ForegroundColor White

# Clean up
Remove-Item oceanai-deploy.zip -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "📋 Environment variables you need to add:" -ForegroundColor Cyan
Write-Host "MONGO_URI=your_mongodb_connection_string" -ForegroundColor Gray
Write-Host "JWT_KEY=your_jwt_secret" -ForegroundColor Gray
Write-Host "SESSION_SECRET=your_session_secret" -ForegroundColor Gray
Write-Host "GOOGLE_CLIENT_ID=your_google_client_id" -ForegroundColor Gray
Write-Host "GOOGLE_CLIENT_SECRET=your_google_client_secret" -ForegroundColor Gray
Write-Host "EMAIL_USER=your_email@gmail.com" -ForegroundColor Gray
Write-Host "EMAIL_PASS=your_gmail_app_password" -ForegroundColor Gray
