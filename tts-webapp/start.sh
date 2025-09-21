#!/bin/bash

# Start both backend and frontend servers
echo "🚀 Starting Hindi TTS Web Application..."

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start Backend
echo "🐍 Starting FastAPI Backend..."
cd backend
source venv/bin/activate 2>/dev/null || echo "⚠️  Virtual environment not found. Please run setup.sh first."
uvicorn app:app --reload --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "⚛️  Starting React Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ Servers started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8001"
echo "📚 API Docs: http://localhost:8001/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for processes
wait