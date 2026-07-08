#!/bin/bash
set -e

echo "Starting deployment for Abroad Simplified..."

# 1. Pull latest changes from the repository
echo "Pulling latest code from git..."
git pull origin main

# 2. Build and start with Docker Compose
echo "Starting new container with docker-compose on port 4000..."
docker-compose up -d --build

# Optional: Clean up dangling images to save space on the VPS
echo "Cleaning up old images..."
docker image prune -f

echo "Deployment successful! The app is running on port 4000."
