#!/bin/bash

echo "Starting TALASH Milestone 3..."

# Setup backend
echo ""
echo "Setting up backend..."
cd "$(dirname "$0")"
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

echo ""
echo "Starting Flask backend on port 5000..."
python app.py &
BACKEND_PID=$!

# Setup frontend
echo ""
echo "Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

echo ""
echo "Starting React frontend on port 3000..."
npm start &
FRONTEND_PID=$!

echo ""
echo "TALASH Milestone 3 is running!"
echo ""
echo "Backend API: http://localhost:5000"
echo "Frontend App: http://localhost:3000"
echo ""
echo "Default login credentials:"
echo "Admin: admin / admin123"
echo "Recruiter: recruiter / recruiter123"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID