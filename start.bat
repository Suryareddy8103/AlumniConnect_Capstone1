@echo off
echo Starting AlumniConnect Application...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this script from the capproject directory.
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Seeding database with test data...
call npm run seed
if %errorlevel% neq 0 (
    echo Warning: Database seeding failed, but continuing...
)

echo.
echo Starting development server...
echo.
echo ========================================
echo   AlumniConnect is starting up...
echo ========================================
echo.
echo Server will be available at: http://localhost:4000
echo Login page: http://localhost:4000/login.html
echo.
echo Test credentials:
echo   Admin: admin@example.com / ChangeMe123!
echo   Alumni: jennifer.parker@alumni.edu / password123
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
