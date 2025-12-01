# AlumniConnect Startup Script
Write-Host "Starting AlumniConnect Application..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this script from the capproject directory." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Seeding database with test data..." -ForegroundColor Yellow
npm run seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Database seeding failed, but continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AlumniConnect is starting up..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at: http://localhost:4000" -ForegroundColor White
Write-Host "Login page: http://localhost:4000/login.html" -ForegroundColor White
Write-Host ""
Write-Host "Test credentials:" -ForegroundColor White
Write-Host "  Admin: admin@example.com / ChangeMe123!" -ForegroundColor White
Write-Host "  Alumni: jennifer.parker@alumni.edu / password123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npm run dev
