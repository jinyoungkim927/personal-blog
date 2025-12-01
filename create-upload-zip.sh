#!/bin/bash

# Script to create a zip file for GoDaddy upload
echo "Creating deployment package for more-useless.com..."

# Navigate to the project directory
cd /Users/jinyoungkim/Desktop/personal-blog

# Build the site if needed
echo "Building site..."
npm run build

# Create a zip of the public folder contents
echo "Creating zip file..."
cd public
zip -r ../more-useless-deploy.zip . -x "*.DS_Store" "*/.DS_Store"

echo "✅ Deployment package created: more-useless-deploy.zip"
echo ""
echo "Next steps:"
echo "1. Log into GoDaddy"
echo "2. Go to your hosting File Manager"
echo "3. Navigate to public_html folder"
echo "4. Upload more-useless-deploy.zip"
echo "5. Extract the zip file"
echo "6. Delete the zip file after extraction"
echo ""
echo "Your site will be live at https://more-useless.com!"
