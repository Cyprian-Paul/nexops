<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    send_response(401, ['error' => 'Not logged in']);
}

$data = json_decode(file_get_contents('php://input'), true);

$fields = [];
$values = [];

if (isset($data['name'])) {
    $name = trim($data['name']);
    if (!$name) {
        send_response(400, ['error' => 'Name cannot be empty']);
    }
    $fields[] = 'name = ?';
    $values[] = $name;
}

if (isset($data['email'])) {
    $email = trim($data['email']);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        send_response(400, ['error' => 'Invalid email format']);
    }

    $check = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
    $check->execute([$email, $_SESSION['user_id']]);
    if ($check->fetch()) {
        send_response(409, ['error' => 'That email is already in use']);
    }

    $fields[] = 'email = ?';
    $values[] = $email;
}

if (isset($data['department'])) {
    $fields[] = 'department = ?';
    $values[] = trim($data['department']);
}

if (isset($data['profile_picture'])) {
    $fields[] = 'profile_picture = ?';
    $values[] = $data['profile_picture'];
}

if (empty($fields)) {
    send_response(400, ['error' => 'No changes provided']);
}

$values[] = $_SESSION['user_id'];

$sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
$stmt = $pdo->prepare($sql);
$stmt->execute($values);

send_response(200, ['message' => 'Profile updated']);
