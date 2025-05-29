#!/bin/bash

# Setup Script for The Internship Book - Instamojo Integration
# This script helps you set up the complete pre-order system

echo "🚀 Setting up The Internship Book Pre-order System..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install npm."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your credentials."
else
    echo "ℹ️  .env file already exists"
fi

# Create directories if they don't exist
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p backups

echo "🔧 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your Instamojo credentials"
echo "2. Configure your email settings in .env"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Visit http://localhost:3000 to test the system"
echo ""
echo "📚 Documentation:"
echo "- Check the implementation guide for detailed setup instructions"
echo "- Test with Instamojo test credentials first"
echo "- Make sure to set up webhooks in your Instamojo dashboard"
echo ""
echo "🆘 Need help?"
echo "- Email: support@teeninterns.com"
echo "- Check the troubleshooting section in the implementation guide"
echo ""
echo "Happy coding! 🎉"
