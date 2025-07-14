# Ocean AI - Final Production Deployment Script
Write-Host "🌊 Ocean AI - Final Production Deployment" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"
$RESOURCE_GROUP = "EXE"
$LOCATION = "Southeast Asia"

# Check Azure CLI login
Write-Host "🔐 Checking Azure CLI authentication..." -ForegroundColor Yellow
try {
    $account = az account show --query "name" -o tsv 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Please login to Azure CLI first: az login" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Logged in as: $account" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI not found or not logged in" -ForegroundColor Red
    exit 1
}

# Menu for deployment options
Write-Host ""
Write-Host "📋 Deployment Options:" -ForegroundColor Cyan
Write-Host "1. Quick Deploy to existing OceanAI (Node Backend only)" -ForegroundColor White
Write-Host "2. Full Deploy - All services (Node + AI + Frontend)" -ForegroundColor White
Write-Host "3. Deploy Node Backend only to new app" -ForegroundColor White
Write-Host "4. Deploy AI Backend only to new app" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Quick Deploy to OceanAI..." -ForegroundColor Green
        
        # Deploy to existing OceanAI
        Set-Location node_backend
        Compress-Archive -Path * -DestinationPath ..\oceanai-deploy.zip -Force -Exclude node_modules,.env,*.log,screenshots
        Set-Location ..

        az webapp deployment source config-zip `
            --resource-group $RESOURCE_GROUP `
            --name "OceanAI" `
            --src oceanai-deploy.zip

        az webapp config set `
            --resource-group $RESOURCE_GROUP `
            --name "OceanAI" `
            --startup-file "node index.js"

        Write-Host "✅ Deployed to: https://oceanai.azurewebsites.net" -ForegroundColor Green
        Remove-Item oceanai-deploy.zip -ErrorAction SilentlyContinue
    }
    
    "2" {
        Write-Host "🚀 Full Deployment - All Services..." -ForegroundColor Green
        
        # Create App Service Plan
        Write-Host "📋 Creating App Service Plan..." -ForegroundColor Yellow
        az appservice plan create `
            --name "oceanai-production-plan" `
            --resource-group $RESOURCE_GROUP `
            --sku B1 `
            --is-linux

        # Deploy Node Backend
        Write-Host "🚀 Deploying Node Backend..." -ForegroundColor Yellow
        Set-Location node_backend
        Compress-Archive -Path * -DestinationPath ..\node-backend.zip -Force -Exclude node_modules,.env,*.log
        Set-Location ..

        az webapp create `
            --resource-group $RESOURCE_GROUP `
            --plan oceanai-production-plan `
            --name "oceanai-node" `
            --runtime "NODE|20-lts"

        az webapp deployment source config-zip `
            --resource-group $RESOURCE_GROUP `
            --name "oceanai-node" `
            --src node-backend.zip

        # Deploy AI Backend
        Write-Host "🤖 Deploying AI Backend..." -ForegroundColor Yellow
        Set-Location AI-backend
        Compress-Archive -Path * -DestinationPath ..\ai-backend.zip -Force -Exclude __pycache__,.env,reports
        Set-Location ..

        az webapp create `
            --resource-group $RESOURCE_GROUP `
            --plan oceanai-production-plan `
            --name "oceanai-ai" `
            --runtime "PYTHON|3.9"

        az webapp deployment source config-zip `
            --resource-group $RESOURCE_GROUP `
            --name "oceanai-ai" `
            --src ai-backend.zip

        # Deploy Frontend
        Write-Host "🎨 Deploying Frontend..." -ForegroundColor Yellow
        Set-Location Ocean-AI-frontend
        npm install express --save
        npm install
        npm run build
        Compress-Archive -Path * -DestinationPath ..\frontend.zip -Force -Exclude node_modules\.cache,src,public
        Set-Location ..

        az webapp create `
            --resource-group $RESOURCE_GROUP `
            --plan oceanai-production-plan `
            --name "oceanai-frontend" `
            --runtime "NODE|20-lts"

        az webapp deployment source config-zip `
            --resource-group $RESOURCE_GROUP `
            --name "oceanai-frontend" `
            --src frontend.zip

        az webapp config set `
            --resource-group $RESOURCE_GROUP `
            --name "oceanai-frontend" `
            --startup-file "node server.js"

        Write-Host "✅ Full deployment completed!" -ForegroundColor Green
        Write-Host "🌐 Your applications:" -ForegroundColor Cyan
        Write-Host "   • Node Backend: https://oceanai-node.azurewebsites.net" -ForegroundColor White
        Write-Host "   • AI Backend: https://oceanai-ai.azurewebsites.net" -ForegroundColor White  
        Write-Host "   • Frontend: https://oceanai-frontend.azurewebsites.net" -ForegroundColor White

        # Cleanup
        Remove-Item node-backend.zip, ai-backend.zip, frontend.zip -ErrorAction SilentlyContinue
    }
    
    "3" {
        Write-Host "🚀 Deploying Node Backend only..." -ForegroundColor Green
        $appName = Read-Host "Enter app service name for Node Backend"
        
        Set-Location node_backend
        Compress-Archive -Path * -DestinationPath ..\node-backend.zip -Force -Exclude node_modules,.env,*.log
        Set-Location ..

        az webapp create `
            --resource-group $RESOURCE_GROUP `
            --plan "oceanai-production-plan" `
            --name $appName `
            --runtime "NODE|20-lts"

        az webapp deployment source config-zip `
            --resource-group $RESOURCE_GROUP `
            --name $appName `
            --src node-backend.zip

        Write-Host "✅ Node Backend deployed to: https://$appName.azurewebsites.net" -ForegroundColor Green
        Remove-Item node-backend.zip -ErrorAction SilentlyContinue
    }
    
    "4" {
        Write-Host "🤖 Deploying AI Backend only..." -ForegroundColor Green
        $appName = Read-Host "Enter app service name for AI Backend"
        
        Set-Location AI-backend
        Compress-Archive -Path * -DestinationPath ..\ai-backend.zip -Force -Exclude __pycache__,.env,reports
        Set-Location ..

        az webapp create `
            --resource-group $RESOURCE_GROUP `
            --plan "oceanai-production-plan" `
            --name $appName `
            --runtime "PYTHON|3.9"

        az webapp deployment source config-zip `
            --resource-group $RESOURCE_GROUP `
            --name $appName `
            --src ai-backend.zip

        Write-Host "✅ AI Backend deployed to: https://$appName.azurewebsites.net" -ForegroundColor Green
        Remove-Item ai-backend.zip -ErrorAction SilentlyContinue
    }
    
    "5" {
        Write-Host "👋 Goodbye!" -ForegroundColor Yellow
        exit 0
    }
    
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure environment variables in Azure Portal" -ForegroundColor White
Write-Host "2. Test your deployment with: .\test-deployment.ps1" -ForegroundColor White
Write-Host "3. Update Chrome extension URLs" -ForegroundColor White
Write-Host "4. Test end-to-end functionality" -ForegroundColor White

Write-Host ""
Write-Host "📚 For detailed configuration, see:" -ForegroundColor Cyan
Write-Host "   • DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
Write-Host "   • AZURE_ENV_VARIABLES.md" -ForegroundColor White
