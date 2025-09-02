# Interview Application - Full Stack Teacher Management System

A complete full-stack application built with a CodeIgniter 4 backend and a React frontend for managing teachers and user authentication.

## Features

### Backend (CodeIgniter 4)
- **Authentication System**: JWT-based token authentication
- **User Management**: Register, login, and profile management
- **Teacher Management**: CRUD operations for teacher profiles
- **Database**: PostgreSQL/MySQL support with 1-to-1 relationships
- **API Endpoints**: RESTful API design with proper validation

### Frontend (React)
- **Modern UI**: Responsive design using Tailwind CSS
- **Authentication**: Login and register forms with validation
- **Dashboard**: Overview with statistics and quick actions
- **Data Tables**: Searchable and filterable data tables
- **Real-time Updates**: Toast notifications and loading states

## Architecture

```
├── backend/                 # CodeIgniter 4 Backend
│   ├── app/
│   │   ├── Controllers/    # API Controllers
│   │   ├── Models/         # Database Models
│   │   └── Filters/        # Authentication Middleware
│   ├── database/           # Database Schema
│   └── composer.json       # PHP Dependencies
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── contexts/       # Authentication Context
│   │   ├── services/       # API Services
│   │   └── App.js         # Main Application
│   ├── package.json        # Node.js Dependencies
│   └── tailwind.config.js  # Tailwind Configuration
└── README.md               # This file
```

## Database Schema

### Tables

#### `auth_user`
- `id` (Primary Key)
- `email` (Unique)
- `first_name`
- `last_name`
- `password` (Hashed)
- `created_at`
- `updated_at`

#### `teachers`
- `id` (Primary Key)
- `user_id` (Foreign Key to auth_user.id)
- `university_name`
- `gender` (ENUM: male, female, other)
- `year_joined`
- `created_at`
- `updated_at`

**Relationship**: 1-to-1 between `auth_user` and `teachers`

## Installation & Setup

### Prerequisites
- PHP 7.4+ with extensions: mysqli, json, mbstring
- Composer
- Node.js 16+ and npm
- MySQL 5.7+ or PostgreSQL 12+
- Web server (Apache or Nginx) or PHP built-in server

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Database Configuration**
   - Create a new database named `interview_db`
   - Update `app/Config/Database.php` with your database credentials
   - Choose between MySQL or PostgreSQL (uncomment the appropriate config)

4. **Import Database Schema**
   ```bash
   mysql -u username -p interview_db < database/schema.sql
   # OR for PostgreSQL:
   psql -U username -d interview_db -f database/schema.sql
   ```

5. **Set JWT Secret** (Optional)
   ```bash
   export JWT_SECRET="your-secret-key-here"
   ```

6. **Start Backend Server**
   ```bash
   # Using PHP built-in server
   php spark serve --host 0.0.0.0 --port 8000

   # OR using Apache or Nginx (configure virtual host)
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/register-teacher` - Register user with a teacher profile (Protected)
- `GET /api/auth/profile` - Get user profile (Protected)
- `POST /api/auth/logout` - User logout (Protected)

### Teachers
- `GET /api/teachers` - Get all teachers (Protected)
- `GET /api/teachers/{id}` - Get teacher by ID (Protected)
- `POST /api/teachers` - Create teacher (Protected)
- `PUT /api/teachers/{id}` - Update teacher (Protected)
- `DELETE /api/teachers/{id}` - Delete teacher (Protected)

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Login**: User provides email and password, receives a JWT token
2. **Protected Routes**: Include `Authorization: Bearer {token}` header
3. **Token Expiry**: Tokens expire after 24 hours
4. **Auto-logout**: Invalid or expired tokens redirect to login

## Frontend Features

### Components
- **Login/Register**: Form validation with React Hook Form
- **Dashboard**: Displays statistics, recent teachers, and quick actions
- **Teachers Table**: Search, filter, and perform CRUD operations
- **Users Table**: User overview with profile status
- **Navigation**: Responsive navbar showing authentication status

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean and professional interface
- **Icons**: Lucide React icon library

## Usage

### Demo Credentials
- **Email**: Aditya@gmail.com
- **Password**: 12345678

### Getting Started
1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Login with demo credentials or register a new account
4. Explore the dashboard and manage teachers and users

## Configuration

### Environment Variables
```bash
# Backend
JWT_SECRET=your-secret-key-here

# Frontend
REACT_APP_API_URL=http://localhost:8000/api
```

### Database Configuration
Edit `backend/app/Config/Database.php`:
```php
'hostname' => 'localhost',
'username' => 'your_username',
'password' => 'your_password',
'database' => 'interview_db',
'DBDriver' => 'MySQLi', // or 'Postgre' for PostgreSQL
```


---

Built with love using CodeIgniter 4 and React