<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    send_response(401, ['error' => 'Not logged in']);
}

$stmt = $pdo->prepare('
    SELECT id, title, description, category, priority, status, created_at, updated_at
    FROM tickets
    WHERE created_by = ?
    ORDER BY created_at DESC
');
$stmt->execute([$_SESSION['user_id']]);

$tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

send_response(200, ['tickets' => $tickets]);
