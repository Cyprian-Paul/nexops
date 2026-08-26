<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

session_start();

$data = json_decode(file_get_contents('php://input'), true);

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    send_response(400, ['error' => 'Email and password are required']);
}

$stmt = $pdo->prepare('SELECT id, name, email, password_hash, role, department, rank FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    send_response(401, ['error' => 'Invalid email or password']);
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['user_role'] = $user['role'];

send_response(200, [
    'message' => 'Login successful',
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'department' => $user['department'],
        'rank' => $user['rank']
    ]
]);
