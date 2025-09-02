import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { teacherService } from '../services/teacherService';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  GraduationCap,
  Filter,
  RefreshCw
} from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [filterGender, setFilterGender] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
    } catch (error) {
      toast.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingTeacher) {
        await teacherService.updateTeacher(editingTeacher.id, data);
        toast.success('Teacher updated successfully');
      } else {
        await teacherService.createTeacher(data);
        toast.success('Teacher created successfully');
      }
      setShowModal(false);
      setEditingTeacher(null);
      reset();
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    reset({
      user_id: teacher.user_id,
      university_name: teacher.university_name,
      gender: teacher.gender,
      year_joined: teacher.year_joined,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teacherService.deleteTeacher(id);
        toast.success('Teacher deleted successfully');
        fetchTeachers();
      } catch (error) {
        toast.error('Failed to delete teacher');
      }
    }
  };

  const handleAddNew = () => {
    setEditingTeacher(null);
    reset();
    setShowModal(true);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.university_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = !filterGender || teacher.gender === filterGender;
    
    return matchesSearch && matchesGender;
  });

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Teachers</h1>
          <p className="text-secondary-600">Manage teacher profiles and information</p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-secondary-400" />
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="input-field w-32"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <button
            onClick={fetchTeachers}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="table-container">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">Loading teachers...</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="p-8 text-center">
            <GraduationCap className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600 text-lg mb-2">No teachers found</p>
            <p className="text-secondary-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Year Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {teacher.first_name} {teacher.last_name}
                          </div>
                          <div className="text-sm text-secondary-500">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">{teacher.university_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        teacher.gender === 'male' ? 'bg-blue-100 text-blue-800' :
                        teacher.gender === 'female' ? 'bg-pink-100 text-pink-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {teacher.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {teacher.year_joined}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              User ID
            </label>
            <input
              type="number"
              {...register('user_id', { required: 'User ID is required' })}
              className="input-field"
              placeholder="Enter user ID"
            />
            {errors.user_id && (
              <p className="mt-1 text-sm text-red-600">{errors.user_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              University Name
            </label>
            <input
              type="text"
              {...register('university_name', { 
                required: 'University name is required',
                minLength: { value: 2, message: 'University name must be at least 2 characters' }
              })}
              className="input-field"
              placeholder="Enter university name"
            />
            {errors.university_name && (
              <p className="mt-1 text-sm text-red-600">{errors.university_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Gender
            </label>
            <select
              {...register('gender', { required: 'Gender is required' })}
              className="input-field"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Year Joined
            </label>
            <input
              type="number"
              {...register('year_joined', { 
                required: 'Year joined is required',
                min: { value: 1900, message: 'Year must be after 1900' },
                max: { value: new Date().getFullYear(), message: `Year cannot be after ${new Date().getFullYear()}` }
              })}
              className="input-field"
              placeholder="Enter year joined"
            />
            {errors.year_joined && (
              <p className="mt-1 text-sm text-red-600">{errors.year_joined.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              {editingTeacher ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Teachers;
