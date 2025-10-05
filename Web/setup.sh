#!/bin/bash

# CreditScorecerer Web App Setup Script
echo "🚀 Setting up CreditScorecerer Web App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created from template"
    echo "⚠️  Please edit .env file and add your Google Gemini API key"
else
    echo "✅ .env file already exists"
fi

# Check if API key is set
if grep -q "your_gemini_api_key_here" .env; then
    echo "⚠️  Please update your .env file with a valid Google Gemini API key"
    echo "   Get your API key from: https://makersuite.google.com/app/apikey"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get your Google Gemini API key from: https://makersuite.google.com/app/apikey"
echo "2. Update the REACT_APP_GEMINI_API_KEY in your .env file"
echo "3. Run 'npm start' to start the development server"
echo ""
echo "The app will be available at: http://localhost:3000"


