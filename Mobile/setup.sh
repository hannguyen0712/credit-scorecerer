#!/bin/bash

# AI Credit Optimizer Setup Script
echo "🚀 Setting up AI Credit Optimizer..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install additional dependencies for development
echo "🔧 Installing development dependencies..."
npm install --save-dev @types/react @types/react-native

# Install iOS dependencies (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Installing iOS dependencies..."
    cd ios && pod install && cd ..
fi

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p src/components
mkdir -p src/contexts
mkdir -p src/navigation
mkdir -p src/screens
mkdir -p src/screens/auth
mkdir -p src/services
mkdir -p src/styles
mkdir -p src/types
mkdir -p src/utils

# Set up environment variables
echo "🔐 Setting up environment variables..."
cat > .env << EOF
# API Configuration
API_BASE_URL=https://api.aicreditoptimizer.com
API_TIMEOUT=10000

# Authentication
AUTH_TOKEN_KEY=authToken

# Notifications
PUSH_NOTIFICATION_ENABLED=true

# Analytics
ANALYTICS_ENABLED=true
EOF

echo "✅ Setup complete!"
echo ""
echo "📱 To run the app:"
echo "  npm start          # Start Metro bundler"
echo "  npm run android    # Run on Android"
echo "  npm run ios        # Run on iOS"
echo ""
echo "🔧 Development commands:"
echo "  npm run lint       # Run ESLint"
echo "  npm test           # Run tests"
echo "  npm run build:android  # Build Android APK"
echo "  npm run build:ios      # Build iOS app"
echo ""
echo "📚 Documentation:"
echo "  See README.md for detailed information"
echo ""
echo "🎉 Happy coding!"

