import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AuthService {
  setToken(token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeToken() {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async registerTeacher(teacherData) {
    const response = await api.post('/auth/register-teacher', teacherData);
    return response.data;
  }

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }
}

export const authService = new AuthService();
export default api;
