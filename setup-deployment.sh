#!/bin/bash

# Setup Script for sanketdhital.com.np Deployment
# This script helps prepare your project for deployment

echo "🚀 Setting up deployment for sanketdhital.com.np"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Create .gitignore if not exists
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules
.pnp
.pnp.js

# Next.js
.next/
out/
build
dist/

# Logs
*.log
dev.log

# Misc
.DS_Store
*.pem

# Local env files
.env
.env*.local

# Database
*.sqlite
*.sqlite-journal
prisma/dev.db

# Vercel
.vercel
EOF
else
    echo "✅ .gitignore already exists"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: .env file not found"
    echo "Please create .env with your environment variables"
else
    echo "✅ .env file exists (already in .gitignore)"
fi

# Check for vercel.json
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json configuration found"
else
    echo "⚠️  vercel.json not found"
fi

# Check database
if [ -f "prisma/dev.db" ]; then
    echo "✅ Database found at prisma/dev.db"
else
    echo "⚠️  Database not found. Run: bun run db:push"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Create a GitHub repository"
echo "2. Run: git add ."
echo "3. Run: git commit -m 'Initial commit'"
echo "4. Run: git remote add origin https://github.com/YOUR_USERNAME/sanket-portfolio.git"
echo "5. Run: git push -u origin main"
echo ""
echo "6. Go to vercel.com and import your repository"
echo "7. Add domain: sanketdhital.com.np in Vercel settings"
echo "8. Update DNS records at your domain registrar"
echo ""
echo "📚 Full guide: DEPLOYMENT_GUIDE.md"
echo ""

# Generate NextAuth secret if requested
read -p "Generate NEXTAUTH_SECRET now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v openssl &> /dev/null; then
        SECRET=$(openssl rand -base64 32)
        echo ""
        echo "🔐 Generated NEXTAUTH_SECRET:"
        echo "$SECRET"
        echo ""
        echo "Add this to your Vercel environment variables"
    else
        echo "❌ openssl not found. Install openssl or generate secret online"
    fi
fi

echo ""
echo "✨ Setup complete!"
