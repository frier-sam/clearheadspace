#!/bin/bash

# ClearHeadSpace Firebase Setup Script
echo "🔥 Setting up ClearHeadSpace with Firebase..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "Please provide your Firebase project details:"

# Get project ID
read -p "Enter your Firebase Project ID: " PROJECT_ID

# Get Firebase config
echo "Please provide your Firebase configuration (from Project Settings > General > Your apps):"
read -p "API Key: " API_KEY
read -p "Auth Domain: " AUTH_DOMAIN
read -p "Storage Bucket: " STORAGE_BUCKET
read -p "Messaging Sender ID: " MESSAGING_SENDER_ID
read -p "App ID: " APP_ID
read -p "Measurement ID (optional): " MEASUREMENT_ID

# Create .env file
echo "Creating .env file..."
cat > .env << EOF
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=$API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=$PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=$APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID=$MEASUREMENT_ID

# App Configuration
REACT_APP_APP_NAME=ClearHeadSpace
REACT_APP_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_CHAT=true
REACT_APP_ENABLE_VIDEO_CALLS=true
EOF

# Update .firebaserc
echo "Updating .firebaserc..."
cat > .firebaserc << EOF
{
  "projects": {
    "default": "$PROJECT_ID"
  }
}
EOF

echo "✅ Configuration files updated!"

# Install dependencies
echo "Installing dependencies..."
npm install
cd functions && npm install && cd ..

echo "🚀 Setup complete! Next steps:"
echo "1. Run 'firebase login' if you haven't already"
echo "2. Run 'firebase init' to initialize Firebase services"
echo "3. Run 'npm start' to start development server"
echo "4. Run 'firebase deploy' to deploy to production"

echo ""
echo "📋 Firebase Console Setup Checklist:"
echo "□ Enable Authentication (Email/Password + Google)"
echo "□ Create Firestore Database"
echo "□ Enable Cloud Storage"
echo "□ Enable Cloud Functions"
echo "□ Enable Hosting"
echo "□ Deploy security rules"
