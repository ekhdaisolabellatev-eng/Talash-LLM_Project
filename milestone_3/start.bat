@echo off
echo Starting TALASH Milestone 3...

echo.
echo Setting up backend...
cd /d "%~dp0"
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo Starting Flask backend on port 5000...
start "TALASH Backend" cmd /k "cd /d %~dp0 && venv\Scripts\activate.bat && python app.py"

echo.
echo Setting up frontend...
cd frontend
if not exist node_modules (
    echo Installing Node.js dependencies...
    npm install
)

echo.
echo Starting React frontend on port 3000...
start "TALASH Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo TALASH Milestone 3 is starting up!
echo.
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3000
echo.
echo Default login credentials:
echo Admin: admin / admin123
echo Recruiter: recruiter / recruiter123
echo.
pause