<?php

namespace App\Controllers;

use App\Models\TeacherModel;
use CodeIgniter\RESTful\ResourceController;

class Teacher extends ResourceController
{
    protected $teacherModel;

    public function __construct()
    {
        $this->teacherModel = new TeacherModel();
    }

    public function index()
    {
        $teachers = $this->teacherModel->getTeachersWithUserData();
        return $this->respond($teachers);
    }

    public function show($id = null)
    {
        $teacher = $this->teacherModel->getTeacherWithUserData($id);
        
        if (!$teacher) {
            return $this->failNotFound('Teacher not found');
        }

        return $this->respond($teacher);
    }

    public function create()
    {
        $rules = [
            'user_id'         => 'required|integer|is_not_unique[auth_user.id]',
            'university_name' => 'required|min_length[2]|max_length[100]',
            'gender'          => 'required|in_list[male,female,other]',
            'year_joined'     => 'required|integer|greater_than[1900]|less_than_equal_to[2024]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $payload = $this->request->getJSON(true) ?: $this->request->getPost();
        $data = [
            'user_id'         => $payload['user_id'] ?? null,
            'university_name' => $payload['university_name'] ?? null,
            'gender'          => $payload['gender'] ?? null,
            'year_joined'     => $payload['year_joined'] ?? null,
        ];

        try {
            $teacherId = $this->teacherModel->insert($data);
            
            if ($teacherId) {
                $teacher = $this->teacherModel->find($teacherId);
                return $this->respondCreated([
                    'message' => 'Teacher created successfully',
                    'teacher' => $teacher
                ]);
            } else {
                return $this->failServerError('Failed to create teacher');
            }
        } catch (\Exception $e) {
            return $this->failServerError('Creation failed: ' . $e->getMessage());
        }
    }

    public function update($id = null)
    {
        $teacher = $this->teacherModel->find($id);
        
        if (!$teacher) {
            return $this->failNotFound('Teacher not found');
        }

        $rules = [
            'university_name' => 'permit_empty|min_length[2]|max_length[100]',
            'gender'          => 'permit_empty|in_list[male,female,other]',
            'year_joined'     => 'permit_empty|integer|greater_than[1900]|less_than_equal_to[2024]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [];
        
        $payload = $this->request->getJSON(true) ?: $this->request->getPost();
        if (isset($payload['university_name'])) {
            $data['university_name'] = $payload['university_name'];
        }
        if (isset($payload['gender'])) {
            $data['gender'] = $payload['gender'];
        }
        if (isset($payload['year_joined'])) {
            $data['year_joined'] = $payload['year_joined'];
        }

        if (empty($data)) {
            return $this->failValidationError('No data provided for update');
        }

        try {
            $this->teacherModel->update($id, $data);
            $updatedTeacher = $this->teacherModel->find($id);
            
            return $this->respond([
                'message' => 'Teacher updated successfully',
                'teacher' => $updatedTeacher
            ]);
        } catch (\Exception $e) {
            return $this->failServerError('Update failed: ' . $e->getMessage());
        }
    }

    public function delete($id = null)
    {
        $teacher = $this->teacherModel->find($id);
        
        if (!$teacher) {
            return $this->failNotFound('Teacher not found');
        }

        try {
            $this->teacherModel->delete($id);
            
            return $this->respond([
                'message' => 'Teacher deleted successfully'
            ]);
        } catch (\Exception $e) {
            return $this->failServerError('Deletion failed: ' . $e->getMessage());
        }
    }
}
