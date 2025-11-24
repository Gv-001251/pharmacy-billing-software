#!/bin/bash

echo "Starting MongoDB..."
docker start mongodb 2>/dev/null || docker run -d --name mongodb -p 27017:27017 mongo:latest

echo "Waiting for MongoDB to start..."
sleep 5

echo "Starting backend..."
cd /home/engine/project/backend
npm start &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Testing backend..."
curl -s http://localhost:5050/health || echo "Backend not responding"

echo "Starting frontend..."
cd /home/engine/project/frontend
npm run dev &
FRONTEND_PID=$!

echo "Waiting for frontend to start..."
sleep 5

echo "Testing frontend..."
curl -s http://localhost:3000 | head -5 || echo "Frontend not responding"

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

echo "Services started. Check http://localhost:3000 for frontend and http://localhost:5050 for backend"