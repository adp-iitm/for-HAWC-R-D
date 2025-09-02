<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Config\Services;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $header = $request->getHeader('Authorization');
        
        if (!$header) {
            return Services::response()
                ->setStatusCode(401)
                ->setJSON(['error' => 'Authorization header not found']);
        }

        $token = str_replace('Bearer ', '', $header->getValue());
        
        if (empty($token)) {
            return Services::response()
                ->setStatusCode(401)
                ->setJSON(['error' => 'Token not provided']);
        }

        try {
            $decoded = JWT::decode($token, new Key(getenv('JWT_SECRET') ?: 'your-secret-key', 'HS256'));
            $request->user = $decoded;
            return $request;
        } catch (\Exception $e) {
            return Services::response()
                ->setStatusCode(401)
                ->setJSON(['error' => 'Invalid token']);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do nothing after the request
    }
}
