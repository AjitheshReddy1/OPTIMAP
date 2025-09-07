@echo off
echo Starting AI Matching API Server...
echo.

cd /d "%~dp0"

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting API server...
python api_server.py

pause
