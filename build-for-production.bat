@echo off
REM Build script for production deployment
REM Creates a 'dist-production' folder ready to upload to InfinityFree

echo ========================================
echo 8D Problem Solving Platform
echo Production Build Script
echo ========================================
echo.

REM Step 1: Clean previous build
echo [1/4] Cleaning previous build...
if exist dist-production rmdir /s /q dist-production
mkdir dist-production
echo Done.
echo.

REM Step 2: Build frontend
echo [2/4] Building frontend (React + Vite)...
cd frontend
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
cd ..
echo Done.
echo.

REM Step 3: Copy built files to dist-production
echo [3/4] Copying files to dist-production...

REM Copy frontend build (all contents from frontend/dist)
xcopy /E /I /Y frontend\dist\* dist-production\

REM Copy backend
xcopy /E /I /Y backend dist-production\backend

REM Copy root .htaccess
copy /Y .htaccess dist-production\.htaccess

REM Copy database schema
copy /Y database\schema.sql dist-production\schema.sql

echo Done.
echo.

REM Step 4: Instructions
echo [4/4] Build complete!
echo.
echo ========================================
echo DEPLOYMENT INSTRUCTIONS
echo ========================================
echo.
echo The 'dist-production' folder is ready for deployment.
echo.
echo Next steps:
echo 1. Update database credentials in:
echo    dist-production\backend\config\database.php
echo.
echo 2. Upload 'dist-production' contents to InfinityFree:
echo    - Upload everything inside 'dist-production' folder
echo    - Upload to 'htdocs' folder on InfinityFree
echo.
echo 3. Create MySQL database on InfinityFree and run:
echo    dist-production\schema.sql
echo.
echo ========================================
echo.
pause
