#!/bin/bash

echo "🚀 Starting Hindi TTS Application..."
echo "🔧 Make sure ports 3000 and 8001 are available (or forwarded in Codespaces)"

# Kill any existing processes on these ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8001 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Start backend
echo "🐍 Starting Backend Server (port 8001)..."
cd backend
source venv/bin/activate
uvicorn app:app --reload --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Test backend
if curl -s http://localhost:8001/ > /dev/null; then
    echo "✅ Backend is running on http://localhost:8001"
    echo "📚 API Documentation: http://localhost:8001/docs"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo "⚛️  Starting Frontend Server (port 3000)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Application Started Successfully!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8001"
echo "📚 API Docs: http://localhost:8001/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for processes
wait