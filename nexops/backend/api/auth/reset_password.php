<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

$data = json_decode(file_get_contents('php://input'), true);

$token = $data['token'] ?? '';
$new_password = $data['new_password'] ?? '';

if (!$token || !$new_password) {
    send_response(400, ['error' => 'Token and new password are required']);
}

if (strlen($new_password) < 8) {
    send_response(400, ['error' => 'New password must be at least 8 characters']);
}

$stmt = $pdo->prepare('
    SELECT id, user_id, expires_at, used
    FROM password_resets
    WHERE token = ?
');
$stmt->execute([$token]);
$reset = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$reset || $reset['used'] || strtotime($reset['expires_at']) < time()) {
    send_response(400, ['error' => 'This reset link is invalid or has expired']);
}

$new_hash = password_hash($new_password, PASSWORD_BCRYPT);

$update = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
$update->execute([$new_hash, $reset['user_id']]);

$mark_used = $pdo->prepare('UPDATE password_resets SET used = 1 WHERE id = ?');
$mark_used->execute([$reset['id']]);

send_response(200, ['message' => 'Password reset successful, you can now log in']);
