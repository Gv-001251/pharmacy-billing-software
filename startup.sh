#!/bin/bash

echo "🏥 AISHWARYA PHARMACY - Service Startup Script"
echo "=============================================="

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    local url=$3
    
    echo "Checking $service_name..."
    if curl -s "$url" > /dev/null 2>&1; then
        echo "✅ $service_name is running on port $port"
        return 0
    else
        echo "❌ $service_name is not running on port $port"
        return 1
    fi
}

# Start MongoDB
echo "🍃 Starting MongoDB..."
if docker ps | grep -q "pharmacy-mongo"; then
    echo "MongoDB container already exists, starting it..."
    docker start pharmacy-mongo
else
    echo "Creating new MongoDB container..."
    docker run -d --name pharmacy-mongo -p 27017:27017 mongo:latest
fi

# Wait for MongoDB to start
echo "Waiting for MongoDB to initialize..."
sleep 5

if docker ps | grep -q "pharmacy-mongo"; then
    echo "✅ MongoDB is running"
else
    echo "❌ Failed to start MongoDB"
    exit 1
fi

# Start Backend
echo "🚀 Starting Backend..."
cd /home/engine/project/backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Start backend in background
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

if check_service "Backend" 5050 "http://localhost:5050/health"; then
    echo "✅ Backend is ready"
else
    echo "❌ Backend failed to start"
    echo "Backend logs:"
    cat ../backend.log
    exit 1
fi

# Start Frontend
echo "⚛️ Starting Frontend..."
cd /home/engine/project/frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

# Wait for frontend to start
echo "Waiting for frontend to start..."
sleep 5

if check_service "Frontend" 3000 "http://localhost:3000"; then
    echo "✅ Frontend is ready"
else
    echo "❌ Frontend failed to start"
    echo "Frontend logs:"
    cat ../frontend.log
    exit 1
fi

echo ""
echo "🎉 Services Status:"
echo "=================="
check_service "MongoDB" 27017 "http://localhost:27017"
check_service "Backend API" 5050 "http://localhost:5050/health"

echo ""
echo "📍 Access URLs:"
echo "==============="
echo "🌐 Frontend Application: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5050"
echo "🏥 Health Check: http://localhost:5050/health"
echo "📊 API Documentation: http://localhost:5050/"

echo ""
echo "🔧 Troubleshooting:"
echo ""
echo "If the frontend shows a blank page:"
echo "1. Check browser console for errors (F12 -> Console)"
echo "2. Make sure MongoDB is running: docker ps | grep pharmacy-mongo"
echo "3. Check logs: tail -f /home/engine/project/backend.log"
echo "4. Check logs: tail -f /home/engine/project/frontend.log"

echo ""
echo "💡 To stop services:"
echo "==================="
echo "Stop frontend: pkill -f 'vite'"
echo "Stop backend: pkill -f 'node src/server.js'"
echo "Stop MongoDB: docker stop pharmacy-mongo"

echo ""
echo "🎯 Ready to use! Open http://localhost:3000 in your browser."