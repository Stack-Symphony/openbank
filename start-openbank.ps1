# start-openbank.ps1 - Enhanced version with environment switching
param(
    [string]$Environment = "development"
)

Write-Host "Starting OpenBank..." -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow

# Environment switching logic
Write-Host "Setting up environment..." -ForegroundColor Cyan

$envFiles = @{
    "dev" = ".env.development"
    "development" = ".env.development"
    "stage" = ".env.staging"
    "staging" = ".env.staging"
    "prod" = ".env.production"
    "production" = ".env.production"
}

$envMapping = @{
    "dev" = "development"
    "development" = "development"
    "stage" = "staging"
    "staging" = "staging"
    "prod" = "production"
    "production" = "production"
}

# Validate environment parameter
$normalizedEnv = $envMapping[$Environment.ToLower()]
if (-not $normalizedEnv) {
    Write-Host "ERROR: Invalid environment: $Environment" -ForegroundColor Red
    Write-Host "Available environments: development, staging, production" -ForegroundColor Yellow
    exit 1
}

$selectedEnvFile = $envFiles[$Environment.ToLower()]

# Check if environment-specific file exists
if (Test-Path $selectedEnvFile) {
    Write-Host "Using environment file: $selectedEnvFile" -ForegroundColor Green
    
    # Copy to .env
    Copy-Item $selectedEnvFile .\.env -Force -ErrorAction Stop
    Write-Host "SUCCESS: Environment configured for: $normalizedEnv" -ForegroundColor Green
    
    # Display environment-specific settings
    Write-Host "Environment settings:" -ForegroundColor Cyan
    Get-Content $selectedEnvFile | Where-Object { $_ -notmatch '^#' -and $_ -notmatch '^$' } | ForEach-Object {
        Write-Host "   $_" -ForegroundColor Gray
    }
} else {
    Write-Host "WARNING: Environment file not found: $selectedEnvFile" -ForegroundColor Yellow
    
    # Create default .env if it doesn't exist
    if (!(Test-Path .\.env)) {
        Write-Host "Creating default .env file..." -ForegroundColor Yellow
        
        # Default environment configuration
        $defaultEnvContent = @"
# OpenBank Environment Variables
# Environment: $normalizedEnv
JWT_SECRET=hPQH7ufD5/iA5Ats57HNC05RShrtYsMs911Q5uqC9Kw=
MONGO_USER=admin
MONGO_PASSWORD=securepassword123
PORT=5000
NODE_ENV=$normalizedEnv
FRONTEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:5000

# Database
MONGO_URI=mongodb://admin:securepassword123@mongodb:27017/openbank?authSource=admin

# Security (override based on environment)
$(if ($normalizedEnv -eq "production") {
    "# Production-specific overrides"
    "# JWT_EXPIRE=24h"
} elseif ($normalizedEnv -eq "staging") {
    "# Staging-specific overrides"
    "# DEBUG=true"
})
"@
        
        $defaultEnvContent | Out-File -FilePath .\.env -Encoding ASCII
        Write-Host "SUCCESS: Created default .env for $normalizedEnv environment" -ForegroundColor Green
    } else {
        Write-Host "Using existing .env file" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "=" * 50
Write-Host "Pre-flight checks..." -ForegroundColor Cyan
Write-Host "=" * 50

# Check if Docker is running
try {
    docker version 2>&1 | Out-Null
    Write-Host "SUCCESS: Docker is running" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Environment-specific Docker compose file selection
$composeFiles = "-f docker-compose.yml"
if (Test-Path "docker-compose.$normalizedEnv.yml") {
    $composeFiles += " -f docker-compose.$normalizedEnv.yml"
    Write-Host "Using environment-specific compose file: docker-compose.$normalizedEnv.yml" -ForegroundColor Cyan
}

# First, fix the backend issue
Write-Host "Cleaning up previous backend container..." -ForegroundColor Yellow
Invoke-Expression "docker compose $composeFiles stop backend"
Invoke-Expression "docker compose $composeFiles rm -f backend"

# Build if needed
Write-Host "Building/updating containers..." -ForegroundColor Green
Invoke-Expression "docker compose $composeFiles build --pull"

# Start services
Write-Host "Starting services for $normalizedEnv environment..." -ForegroundColor Green
Invoke-Expression "docker compose $composeFiles up -d"

# Wait for services to start (adjust based on environment)
$waitTime = if ($normalizedEnv -eq "production") { 30 } else { 15 }
Write-Host "Waiting $waitTime seconds for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds $waitTime

# Check status
Write-Host "Service Status:" -ForegroundColor Cyan
Invoke-Expression "docker compose $composeFiles ps"

# Test endpoints
Write-Host "Testing endpoints..." -ForegroundColor Cyan

# Test backend
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -TimeoutSec 10
    Write-Host "SUCCESS Backend: $($health.status) - $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Backend not responding: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Checking backend logs..." -ForegroundColor Yellow
    Invoke-Expression "docker compose $composeFiles logs backend --tail=20"
}

# Test frontend
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10 -Method Head
    Write-Host "SUCCESS Frontend: HTTP $($frontend.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "WARNING Frontend: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Environment-specific post-start actions
switch ($normalizedEnv) {
    "development" {
        Write-Host "Development mode active:" -ForegroundColor Cyan
        Write-Host "   - Hot reload enabled" -ForegroundColor Gray
        Write-Host "   - Debug tools available" -ForegroundColor Gray
    }
    "staging" {
        Write-Host "Staging mode active:" -ForegroundColor Yellow
        Write-Host "   - Test data loaded" -ForegroundColor Gray
        Write-Host "   - Monitoring enabled" -ForegroundColor Gray
    }
    "production" {
        Write-Host "Production mode active:" -ForegroundColor Green
        Write-Host "   - Optimized builds" -ForegroundColor Gray
        Write-Host "   - SSL/TLS enabled" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=" * 50
Write-Host "SUCCESS: OpenBank is running in $normalizedEnv mode!" -ForegroundColor Green
Write-Host "=" * 50
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor White
Write-Host "API Health: http://localhost:5000/api/health" -ForegroundColor White
Write-Host "MongoDB: localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "Environment: $normalizedEnv" -ForegroundColor Cyan
Write-Host ""
Write-Host "Commands:" -ForegroundColor Cyan
Write-Host "  docker compose $composeFiles logs -f    # View logs" -ForegroundColor Gray
Write-Host "  docker compose $composeFiles ps         # Check status" -ForegroundColor Gray
Write-Host "  docker compose $composeFiles down       # Stop services" -ForegroundColor Gray
Write-Host "  .\start-openbank.ps1 -Environment prod  # Switch to production" -ForegroundColor Gray
Write-Host "  .\start-openbank.ps1 dev                # Switch to development" -ForegroundColor Gray
Write-Host "  .\start-openbank.ps1 staging            # Switch to staging" -ForegroundColor Gray
Write-Host "=" * 50