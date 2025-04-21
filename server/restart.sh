#!/bin/bash

# Stop and remove existing container (if running)
echo "Stopping existing container..."
docker stop socket-server 2>/dev/null
echo "Removing existing container..."
docker rm socket-server 2>/dev/null

# Build the new Docker image
echo "Building Docker image..."
docker build -t monopoly-socket-server .

echo "Running new container..."
# Run the container in detached mode
docker run -d -p 3000:3000 --name socket-server monopoly-socket-server

echo "Container is now running on port 3000."
