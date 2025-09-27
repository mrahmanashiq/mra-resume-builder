#!/bin/bash

# Deploy script for MRA Resume Builder
# This script commits all changes and pushes to GitHub for automatic deployment

echo "🚀 MRA Resume Builder - Deploy to GitHub Pages"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected. Adding all files..."
    
    # Add all changes
    git add .
    
    # Prompt for commit message
    echo "💬 Enter commit message (or press Enter for default):"
    read -r commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Update resume builder - $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    # Commit changes
    echo "✅ Committing changes..."
    git commit -m "$commit_message"
else
    echo "✅ No uncommitted changes found."
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin master

echo ""
echo "🎉 Deployment initiated!"
echo "📍 Your site will be available at: https://mrahmanashiq.github.io/mra-resume-builder/"
echo "⏱️  GitHub Actions will build and deploy automatically (usually takes 2-3 minutes)"
echo ""
echo "You can check the deployment status at:"
echo "🔗 https://github.com/mrahmanashiq/mra-resume-builder/actions"