#!/bin/bash

# Setup script for RPG Dashboard
# This copies example data files to get you started

echo "🎮 Setting up RPG Dashboard..."

# Create data directory if it doesn't exist
mkdir -p data

# Copy example files to actual data files
cp data/log.json.example data/log.json
cp data/quests.json.example data/quests.json  
cp data/streaks.json.example data/streaks.json

echo "✅ Sample data files created!"
echo "🚀 You can now run 'npm run dev' to start the application"
echo "📝 Your personal data will be stored in /data/*.json files (gitignored)"