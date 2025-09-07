@echo off
echo Starting OPT-MAP with AI Matching...
echo.

echo Starting Python API server...
start "AI API Server" cmd /k "python api_server.py"

echo Waiting for API server to start...
timeout /t 5 /nobreak > nul

echo Starting React development server...
start "React App" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo AI API Server: http://localhost:5000
echo React App: http://localhost:8080
echo.
echo Press any key to exit...
pause > nul
