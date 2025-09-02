<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class Home extends Controller
{
    public function index()
    {
        return $this->response->setJSON([
            'message' => 'Interview Backend API',
            'version' => '1.0.0',
            'endpoints' => [
                'auth' => [
                    'POST /api/auth/register' => 'Register a new user',
                    'POST /api/auth/login' => 'Login user',
                    'POST /api/auth/register-teacher' => 'Register user with teacher profile (protected)',
                    'GET /api/auth/profile' => 'Get user profile (protected)',
                    'POST /api/auth/logout' => 'Logout user (protected)'
                ],
                'teachers' => [
                    'GET /api/teachers' => 'Get all teachers (protected)',
                    'GET /api/teachers/{id}' => 'Get teacher by ID (protected)',
                    'POST /api/teachers' => 'Create teacher (protected)',
                    'PUT /api/teachers/{id}' => 'Update teacher (protected)',
                    'DELETE /api/teachers/{id}' => 'Delete teacher (protected)'
                ]
            ]
        ]);
    }
}
