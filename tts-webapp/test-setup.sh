#!/bin/bash

echo "🧪 Testing Hindi TTS Application..."
echo "=================================="

# Test backend health
echo "1. Testing Backend Health (port 8001)..."
if curl -s http://localhost:8001/ > /dev/null; then
    echo "✅ Backend is responding on port 8001"
    echo "📋 Backend response:"
    curl -s http://localhost:8001/ | python3 -m json.tool || curl -s http://localhost:8001/
else
    echo "❌ Backend is not responding on port 8001"
    echo "💡 Make sure to start the backend: cd backend && source venv/bin/activate && uvicorn app:app --host 0.0.0.0 --port 8001"
fi

echo ""

# Test frontend
echo "2. Testing Frontend (port 3000)..."
if curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ Frontend is responding on port 3000"
else
    echo "❌ Frontend is not responding on port 3000"
    echo "💡 Make sure to start the frontend: cd frontend && npm start"
fi

echo ""

# Test API docs
echo "3. Testing API Documentation..."
if curl -s http://localhost:8001/docs > /dev/null; then
    echo "✅ API docs are available at http://localhost:8001/docs"
else
    echo "❌ API docs are not accessible"
fi

echo ""
echo "🎯 Quick Start Commands:"
echo "Backend: cd /workspaces/TTS/tts-webapp/backend && source venv/bin/activate && uvicorn app:app --host 0.0.0.0 --port 8001 --reload"
echo "Frontend: cd /workspaces/TTS/tts-webapp/frontend && npm start"
echo "Or use: cd /workspaces/TTS/tts-webapp && ./start.sh"