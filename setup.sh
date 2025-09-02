#!/bin/bash

echo "========================================"
echo "Interview Application Setup Script"
echo "========================================"
echo

echo "Setting up Backend..."
cd backend
if [ -f "composer.phar" ]; then
    echo "Installing PHP dependencies..."
    php composer.phar install
else
    echo "Installing Composer dependencies..."
    composer install
fi
cd ..

echo
echo "Setting up Frontend..."
cd frontend
echo "Installing Node.js dependencies..."
npm install
cd ..

echo
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo
echo "Next steps:"
echo "1. Configure database in backend/app/Config/Database.php"
echo "2. Import database schema from backend/database/schema.sql"
echo "3. Start backend: cd backend && php spark serve --port 8000"
echo "4. Start frontend: cd frontend && npm start"
echo
echo "Demo credentials: john.doe@university.edu / password"
echo
