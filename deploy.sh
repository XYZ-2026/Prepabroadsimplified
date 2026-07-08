#!/bin/bash
set -e

echo "Starting deployment for Abroad Simplified..."

# Define variables
IMAGE_NAME="abroad-simplified-app"
CONTAINER_NAME="abroad-simplified-container"
PORT=3000

# 1. Pull latest changes from the repository
# (Assumes this script is run from inside the git repository on the VPS)
echo "Pulling latest code from git..."
git pull origin main

# 2. Build the new Docker image
echo "Building Docker image..."
docker build -t $IMAGE_NAME .

# 3. Stop and remove the existing container if it is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping existing container..."
    docker stop $CONTAINER_NAME
fi

if [ "$(docker ps -aq -f status=exited -f name=$CONTAINER_NAME)" ]; then
    echo "Removing stopped container..."
    docker rm $CONTAINER_NAME
fi

# 4. Run the new container
echo "Starting new container on port $PORT..."
docker run -d --name $CONTAINER_NAME -p $PORT:3000 --restart unless-stopped \
  --env-file .env \
  $IMAGE_NAME

# Optional: Clean up dangling images to save space on the VPS
echo "Cleaning up old images..."
docker image prune -f

echo "Deployment successful! The app is running on port $PORT."
