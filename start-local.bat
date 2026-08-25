@echo off
title IRENA Scenario Dialogue Tool
color 1F

echo.
echo  ====================================================
echo   IRENA Scenario Dialogue Tool - Local Server
echo  ====================================================
echo.

:: Check Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Node.js is not installed.
    echo  Please install Node.js from https://nodejs.org
    echo  Then run this file again.
    echo.
    pause
    exit /b 1
)

:: Install dependencies if node_modules is missing
if not exist node_modules\ (
    echo  Installing dependencies (first run only, takes 1-2 minutes)...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo  ERROR: Failed to install dependencies.
        echo  Check your internet connection and try again.
        pause
        exit /b 1
    )
    echo.
)

echo  Starting local server...
echo.
echo  The tool will open automatically in your browser.
echo  If it doesn't open, navigate to:  http://localhost:5173/stakeholder-dialogue/
echo.
echo  Press Ctrl+C to stop the server.
echo.

:: Start the dev server and open browser
start "" "http://localhost:5173/stakeholder-dialogue/"
npm run dev
