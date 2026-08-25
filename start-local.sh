#!/bin/bash
# IRENA Scenario Dialogue Tool — Local Server
# Usage: ./start-local.sh   (Mac/Linux)

set -e

echo ""
echo " ===================================================="
echo "  IRENA Scenario Dialogue Tool - Local Server"
echo " ===================================================="
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
    echo " ERROR: Node.js is not installed."
    echo " Please install Node.js from https://nodejs.org"
    echo " Then run this script again."
    exit 1
fi

# Install dependencies if needed
if [ ! -d node_modules ]; then
    echo " Installing dependencies (first run only, takes 1-2 minutes)..."
    echo ""
    npm install
    echo ""
fi

echo " Starting local server..."
echo ""
echo " The tool will open automatically in your browser."
echo " If it doesn't open, navigate to:  http://localhost:5173/stakeholder-dialogue/"
echo ""
echo " Press Ctrl+C to stop the server."
echo ""

# Open browser (works on macOS and most Linux desktops)
sleep 2 && (
    if command -v open &>/dev/null; then
        open "http://localhost:5173/stakeholder-dialogue/"
    elif command -v xdg-open &>/dev/null; then
        xdg-open "http://localhost:5173/stakeholder-dialogue/"
    fi
) &

npm run dev
