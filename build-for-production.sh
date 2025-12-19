#!/bin/bash
# Build script for production deployment
# Creates a 'dist-production' folder ready to upload to InfinityFree

echo "========================================"
echo "8D Problem Solving Platform"
echo "Production Build Script"
echo "========================================"
echo ""

# Step 1: Clean previous build
echo "[1/4] Cleaning previous build..."
rm -rf dist-production
mkdir dist-production
echo "Done."
echo ""

# Step 2: Build frontend
echo "[2/4] Building frontend (React + Vite)..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend build failed!"
    exit 1
fi
cd ..
echo "Done."
echo ""

# Step 3: Copy built files to dist-production
echo "[3/4] Copying files to dist-production..."

# Copy frontend build (all contents from frontend/dist)
cp -r frontend/dist/* dist-production/

# Copy backend
cp -r backend dist-production/

# Copy root .htaccess
cp .htaccess dist-production/

# Copy database schema
cp database/schema.sql dist-production/

echo "Done."
echo ""

# Step 4: Instructions
echo "[4/4] Build complete!"
echo ""
echo "========================================"
echo "DEPLOYMENT INSTRUCTIONS"
echo "========================================"
echo ""
echo "The 'dist-production' folder is ready for deployment."
echo ""
echo "Next steps:"
echo "1. Update database credentials in:"
echo "   dist-production/backend/config/database.php"
echo ""
echo "2. Upload 'dist-production' contents to InfinityFree:"
echo "   - Upload everything inside 'dist-production' folder"
echo "   - Upload to 'htdocs' folder on InfinityFree"
echo ""
echo "3. Create MySQL database on InfinityFree and run:"
echo "   dist-production/schema.sql"
echo ""
echo "========================================"
echo ""
