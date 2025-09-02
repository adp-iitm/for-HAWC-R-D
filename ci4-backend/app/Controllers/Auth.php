<?php

namespace App\Controllers;

use App\Models\AuthUserModel;
use App\Models\TeacherModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth extends ResourceController
{
    protected $authUserModel;
    protected $teacherModel;

    public function __construct()
    {
        $this->authUserModel = new AuthUserModel();
        $this->teacherModel = new TeacherModel();
    }

    public function register()
    {
        $rules = [
            'email'      => 'required|valid_email|is_unique[auth_user.email]',
            'first_name' => 'required|min_length[2]|max_length[50]',
            'last_name'  => 'required|min_length[2]|max_length[50]',
            'password'   => 'required|min_length[6]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $payload = $this->request->getJSON(true) ?: $this->request->getPost();
        $data = [
            'email'      => $payload['email'] ?? null,
            'first_name' => $payload['first_name'] ?? null,
            'last_name'  => $payload['last_name'] ?? null,
            'password'   => $payload['password'] ?? null,
        ];

        try {
            $userId = $this->authUserModel->insert($data);
            
            if ($userId) {
                $user = $this->authUserModel->find($userId);
                unset($user['password']);
                
                return $this->respondCreated([
                    'message' => 'User registered successfully',
                    'user' => $user
                ]);
            } else {
                return $this->failServerError('Failed to create user');
            }
        } catch (\Exception $e) {
            return $this->failServerError('Registration failed: ' . $e->getMessage());
        }
    }

    public function registerTeacher()
    {
        $rules = [
            'email'           => 'required|valid_email|is_unique[auth_user.email]',
            'first_name'      => 'required|min_length[2]|max_length[50]',
            'last_name'       => 'required|min_length[2]|max_length[50]',
            'password'        => 'required|min_length[6]',
            'university_name' => 'required|min_length[2]|max_length[100]',
            'gender'          => 'required|in_list[male,female,other]',
            'year_joined'     => 'required|integer|greater_than[1900]|less_than_equal_to[2024]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            // Create user
            $payload = $this->request->getJSON(true) ?: $this->request->getPost();
            $userData = [
                'email'      => $payload['email'] ?? null,
                'first_name' => $payload['first_name'] ?? null,
                'last_name'  => $payload['last_name'] ?? null,
                'password'   => $payload['password'] ?? null,
            ];

            $userId = $this->authUserModel->insert($userData);

            if (!$userId) {
                throw new \Exception('Failed to create user');
            }

            // Create teacher
            $teacherData = [
                'user_id'         => $userId,
                'university_name' => $payload['university_name'] ?? null,
                'gender'          => $payload['gender'] ?? null,
                'year_joined'     => $payload['year_joined'] ?? null,
            ];

            $teacherId = $this->teacherModel->insert($teacherData);

            if (!$teacherId) {
                throw new \Exception('Failed to create teacher profile');
            }

            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->failServerError('Transaction failed');
            }

            // Get complete data
            $user = $this->authUserModel->find($userId);
            $teacher = $this->teacherModel->find($teacherId);
            unset($user['password']);

            return $this->respondCreated([
                'message' => 'Teacher registered successfully',
                'user' => $user,
                'teacher' => $teacher
            ]);

        } catch (\Exception $e) {
            $db->transRollback();
            return $this->failServerError('Registration failed: ' . $e->getMessage());
        }
    }

    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $payload = $this->request->getJSON(true) ?: $this->request->getPost();
        $email = $payload['email'] ?? null;
        $password = $payload['password'] ?? null;

        $user = $this->authUserModel->findByEmail($email);

        if (!$user || !$this->authUserModel->verifyPassword($password, $user['password'])) {
            return $this->failUnauthorized('Invalid email or password');
        }

        // Generate JWT token
        $payload = [
            'user_id' => $user['id'],
            'email'   => $user['email'],
            'iat'     => time(),
            'exp'     => time() + (60 * 60 * 24) // 24 hours
        ];

        $token = JWT::encode($payload, getenv('JWT_SECRET') ?: 'your-secret-key', 'HS256');

        unset($user['password']);

        return $this->respond([
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user
        ]);
    }

    public function profile()
    {
        $userId = $this->request->user->user_id;
        $user = $this->authUserModel->find($userId);
        
        if (!$user) {
            return $this->failNotFound('User not found');
        }

        unset($user['password']);
        return $this->respond($user);
    }

    public function logout()
    {
        // In a real application, you might want to blacklist the token
        return $this->respond([
            'message' => 'Logout successful'
        ]);
    }
}
