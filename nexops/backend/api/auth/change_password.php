<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    send_response(401, ['error' => 'Not logged in']);
}

$data = json_decode(file_get_contents('php://input'), true);

$current_password = $data['current_password'] ?? '';
$new_password = $data['new_password'] ?? '';

if (!$current_password || !$new_password) {
    send_response(400, ['error' => 'Current and new password are required']);
}

if (strlen($new_password) < 8) {
    send_response(400, ['error' => 'New password must be at least 8 characters']);
}

$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($current_password, $user['password_hash'])) {
    send_response(401, ['error' => 'Current password is incorrect']);
}

$new_hash = password_hash($new_password, PASSWORD_BCRYPT);

$update = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
$update->execute([$new_hash, $_SESSION['user_id']]);

send_response(200, ['message' => 'Password updated']);
