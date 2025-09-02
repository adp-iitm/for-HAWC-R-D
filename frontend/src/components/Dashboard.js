import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { teacherService } from '../services/teacherService';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  GraduationCap, 
  Plus, 
  TrendingUp, 
  Calendar,
  MapPin,
  UserCheck
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalUsers: 0,
    recentTeachers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const teachers = await teacherService.getAllTeachers();
      setStats({
        totalTeachers: teachers.length,
        totalUsers: teachers.length, // Since it's 1:1 relationship
        recentTeachers: teachers.slice(0, 5) // Get latest 5
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, link }) => {
    const content = (
      <div className={`bg-white rounded-xl shadow-lg border border-secondary-200 p-6 hover:shadow-xl transition-shadow duration-200 ${link ? 'cursor-pointer' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">{title}</p>
            <p className={`text-3xl font-bold ${color || 'text-secondary-900'}`}>
              {loading ? '...' : value}
            </p>
          </div>
          <div className={`p-3 rounded-full ${color ? color.replace('text-', 'bg-') + '100' : 'bg-secondary-100'}`}>
            <Icon className={`h-6 w-6 ${color || 'text-secondary-600'}`} />
          </div>
        </div>
      </div>
    );

    return link ? <Link to={link}>{content}</Link> : content;
  };

  const RecentTeacherCard = ({ teacher }) => (
    <div className="bg-white rounded-lg border border-secondary-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-secondary-900 truncate">
            {teacher.first_name} {teacher.last_name}
          </p>
          <p className="text-sm text-secondary-500 truncate">{teacher.university_name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-secondary-500">Joined</p>
          <p className="text-sm font-medium text-secondary-900">{teacher.year_joined}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <UserCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.first_name}!</h1>
            <p className="text-primary-100 text-lg">Here's what's happening with your application</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={GraduationCap}
          color="text-blue-600"
          link="/teachers"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="text-green-600"
          link="/users"
        />
        <StatCard
          title="Active Year"
          value={new Date().getFullYear()}
          icon={Calendar}
          color="text-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-secondary-900">Quick Actions</h2>
            <TrendingUp className="h-5 w-5 text-primary-600" />
          </div>
          <div className="space-y-3">
            <Link
              to="/teachers"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
            >
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-secondary-700">View All Teachers</span>
            </Link>
            <Link
              to="/users"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
            >
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-secondary-700">Manage Users</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-secondary-900">Recent Teachers</h2>
            <MapPin className="h-5 w-5 text-primary-600" />
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-secondary-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : stats.recentTeachers.length > 0 ? (
              stats.recentTeachers.map((teacher) => (
                <RecentTeacherCard key={teacher.id} teacher={teacher} />
              ))
            ) : (
              <div className="text-center py-8 text-secondary-500">
                <GraduationCap className="h-12 w-12 mx-auto mb-3 text-secondary-300" />
                <p>No teachers found</p>
                <Link
                  to="/teachers"
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mt-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Teacher</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="card">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-secondary-200">
            <span className="text-secondary-600">Application Version:</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-secondary-200">
            <span className="text-secondary-600">Database Status:</span>
            <span className="font-medium text-green-600">Connected</span>
          </div>
          <div className="flex justify-between py-2 border-b border-secondary-200">
            <span className="text-secondary-600">Last Updated:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-secondary-200">
            <span className="text-secondary-600">Environment:</span>
            <span className="font-medium">Development</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
