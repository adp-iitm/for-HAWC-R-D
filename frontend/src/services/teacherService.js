import api from './authService';

class TeacherService {
  async getAllTeachers() {
    const response = await api.get('/teachers');
    return response.data;
  }

  async getTeacherById(id) {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  }

  async createTeacher(teacherData) {
    const response = await api.post('/teachers', teacherData);
    return response.data;
  }

  async updateTeacher(id, teacherData) {
    const response = await api.put(`/teachers/${id}`, teacherData);
    return response.data;
  }

  async deleteTeacher(id) {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  }
}

export const teacherService = new TeacherService();
