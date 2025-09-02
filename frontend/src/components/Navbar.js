import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, GraduationCap, Home } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b border-secondary-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <GraduationCap className="h-8 w-8" />
              <span className="text-xl font-bold">CampusConnect India</span>
            </Link>
            <div style={{ width: 64, height: 4, background: 'linear-gradient(90deg, #FF9933, #FFFFFF, #138808)' }} className="rounded-full hidden md:block" />
            
            <div className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                to="/teachers" 
                className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Teachers</span>
              </Link>
              
              <Link 
                to="/users" 
                className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <User className="h-4 w-4" />
                <span>Users</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-secondary-600">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">
                {user?.first_name} {user?.last_name}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
