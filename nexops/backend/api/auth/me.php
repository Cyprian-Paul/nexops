<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    send_response(401, ['error' => 'Not logged in']);
}

$stmt = $pdo->prepare('
    SELECT id, name, email, role, department, user_rank, profile_picture
    FROM users
    WHERE id = ?
');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    send_response(404, ['error' => 'User not found']);
}

send_response(200, ['user' => $user]);
