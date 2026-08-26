<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

$data = json_decode(file_get_contents('php://input'), true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'user';
$department = trim($data['department'] ?? '');
$rank = $data['rank'] ?? 'junior';

if (!$name || !$email || !$password) {
    send_response(400, ['error' => 'Name, email, and password are required']);
}

if (!in_array($role, ['admin', 'user'])) {
    $role = 'user';
}

if (!in_array($rank, ['junior', 'senior', 'lead', 'manager'])) {
    $rank = 'junior';
}

$check = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$check->execute([$email]);
if ($check->fetch()) {
    send_response(409, ['error' => 'An account with this email already exists']);
}

$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, role, department, rank) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->execute([$name, $email, $hash, $role, $department, $rank]);

send_response(201, [
    'message' => 'Account created',
    'user' => [
        'id' => $pdo->lastInsertId(),
        'name' => $name,
        'email' => $email,
        'role' => $role,
        'department' => $department,
        'rank' => $rank
    ]
]);
