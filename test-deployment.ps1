# Test Ocean AI Deployment
Write-Host "🧪 Testing Ocean AI Deployment..." -ForegroundColor Cyan

$BASE_URL = "https://oceanai.azurewebsites.net"

Write-Host "Testing endpoints..." -ForegroundColor Yellow

# Test main endpoint
Write-Host "1. Testing main endpoint..." -ForegroundColor White
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/" -Method GET -TimeoutSec 30
    Write-Host "✅ Main endpoint: OK" -ForegroundColor Green
    Write-Host "   Response: $response" -ForegroundColor Gray
} catch {
    Write-Host "❌ Main endpoint: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test health endpoint
Write-Host "2. Testing health endpoint..." -ForegroundColor White
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/health" -Method GET -TimeoutSec 30
    Write-Host "✅ Health endpoint: OK" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    Write-Host "   Environment: $($response.environment)" -ForegroundColor Gray
    Write-Host "   Port: $($response.port)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health endpoint: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test register endpoint (without sending data)
Write-Host "3. Testing register endpoint..." -ForegroundColor White
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/register-from-extension" -Method POST -Body '{}' -ContentType "application/json" -TimeoutSec 30
    Write-Host "✅ Register endpoint: Accessible" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Register endpoint: Accessible (400 expected for empty body)" -ForegroundColor Green
    } else {
        Write-Host "❌ Register endpoint: FAILED" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🔍 Check Azure Portal for detailed logs if any tests failed:" -ForegroundColor Yellow
Write-Host "   Azure Portal > App Services > OceanAI > Log stream" -ForegroundColor Gray

Write-Host ""
Write-Host "📋 If everything looks good:" -ForegroundColor Cyan
Write-Host "   • Update Chrome extension with production URL" -ForegroundColor White
Write-Host "   • Configure all environment variables" -ForegroundColor White
Write-Host "   • Test the full workflow with Google Meet" -ForegroundColor White
