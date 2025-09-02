@echo off
echo Starting Interview Application Servers...
echo.

echo Starting Backend Server (CodeIgniter)...
start "Backend Server" cmd /k "cd ci4-backend && php spark serve --port 8000"

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server (React)...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Demo credentials: john.doe@university.edu / password
echo.
pause

