<?php

namespace App\Models;

use CodeIgniter\Model;

class TeacherModel extends Model
{
    protected $table            = 'teachers';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'user_id',
        'university_name',
        'gender',
        'year_joined',
        'created_at',
        'updated_at'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [
        'user_id'         => 'required|integer|is_not_unique[auth_user.id]',
        'university_name' => 'required|min_length[2]|max_length[100]',
        'gender'          => 'required|in_list[male,female,other]',
        'year_joined'     => 'required|integer|greater_than[1900]|less_than_equal_to[2024]'
    ];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    public function getTeachersWithUserData()
    {
        return $this->select('
            teachers.*,
            auth_user.email,
            auth_user.first_name,
            auth_user.last_name
        ')
        ->join('auth_user', 'auth_user.id = teachers.user_id')
        ->findAll();
    }

    public function getTeacherWithUserData($id)
    {
        return $this->select('
            teachers.*,
            auth_user.email,
            auth_user.first_name,
            auth_user.last_name
        ')
        ->join('auth_user', 'auth_user.id = teachers.user_id')
        ->where('teachers.id', $id)
        ->first();
    }
}
