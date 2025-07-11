# Start Development Server Script
# This script sets the required environment variables and starts the development server

Write-Host "Setting up environment variables..." -ForegroundColor Green
$env:DATABASE_URL = "postgresql://postgres:Bunny@999999@localhost:5432/skillsharehub"
$env:NODE_ENV = "development"

Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan

npx tsx server/index.ts 