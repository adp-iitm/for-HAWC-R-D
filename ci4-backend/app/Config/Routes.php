<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// API Routes
$routes->group('api', static function ($routes) {
    // Auth routes
    $routes->post('auth/register', 'Auth::register');
    $routes->post('auth/login', 'Auth::login');
    $routes->post('auth/register-teacher', 'Auth::registerTeacher', ['filter' => 'auth']);
    $routes->get('auth/profile', 'Auth::profile', ['filter' => 'auth']);
    $routes->post('auth/logout', 'Auth::logout', ['filter' => 'auth']);

    // Teacher routes (protected)
    $routes->get('teachers', 'Teacher::index', ['filter' => 'auth']);
    $routes->get('teachers/(:num)', 'Teacher::show/$1', ['filter' => 'auth']);
    $routes->post('teachers', 'Teacher::create', ['filter' => 'auth']);
    $routes->put('teachers/(:num)', 'Teacher::update/$1', ['filter' => 'auth']);
    $routes->delete('teachers/(:num)', 'Teacher::delete/$1', ['filter' => 'auth']);
});
