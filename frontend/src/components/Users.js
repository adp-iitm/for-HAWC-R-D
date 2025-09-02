import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  Users as UsersIcon,   // renamed here
  Search, 
  Filter, 
  RefreshCw,
  User,
  Mail,
  Calendar,
  Shield
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Since we don't have a direct users API, we'll get users from teachers data
      // In a real app, you'd have a separate users endpoint
      const response = await fetch('/api/teachers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const teachers = await response.json();
        // Extract unique users from teachers data
        const uniqueUsers = teachers.reduce((acc, teacher) => {
          if (!acc.find(user => user.id === teacher.user_id)) {
            acc.push({
              id: teacher.user_id,
              email: teacher.email,
              first_name: teacher.first_name,
              last_name: teacher.last_name,
              created_at: teacher.created_at,
              has_teacher_profile: true
            });
          }
          return acc;
        }, []);
        setUsers(uniqueUsers);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || 
      (filterStatus === 'with_profile' && user.has_teacher_profile) ||
      (filterStatus === 'without_profile' && !user.has_teacher_profile);
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Users</h1>
          <p className="text-secondary-600">Manage user accounts and profiles</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-secondary-500">
            Total: {users.length} users
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-secondary-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-40"
            >
              <option value="">All Users</option>
              <option value="with_profile">With Teacher Profile</option>
              <option value="without_profile">Without Teacher Profile</option>
            </select>
          </div>
          
          <button
            onClick={fetchUsers}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <UsersIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600 text-lg mb-2">No users found</p>
            <p className="text-secondary-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Profile
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-secondary-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-secondary-400" />
                        <span className="text-sm text-secondary-900">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.has_teacher_profile 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.has_teacher_profile ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-secondary-400" />
                        <span>{formatDate(user.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {user.has_teacher_profile ? (
                          <>
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">Complete</span>
                          </>
                        ) : (
                          <>
                            <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-sm text-yellow-600">Incomplete</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Users</p>
              <p className="text-3xl font-bold text-secondary-900">{users.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">With Profiles</p>
              <p className="text-3xl font-bold text-green-600">
                {users.filter(u => u.has_teacher_profile).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {users.filter(u => !u.has_teacher_profile).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <div className="h-6 w-6 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
