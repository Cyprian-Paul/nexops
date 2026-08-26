<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    send_response(401, ['error' => 'Not logged in']);
}

$data = json_decode(file_get_contents('php://input'), true);

$title = trim($data['title'] ?? '');
$description = trim($data['description'] ?? '');
$priority = $data['priority'] ?? 'medium';
$category = trim($data['category'] ?? '');

if (!$title || !$description) {
    send_response(400, ['error' => 'Title and description are required']);
}

if (!in_array($priority, ['low', 'medium', 'high', 'urgent'])) {
    $priority = 'medium';
}

$stmt = $pdo->prepare('
    INSERT INTO tickets (title, description, category, priority, status, created_by)
    VALUES (?, ?, ?, ?, "open", ?)
');
$stmt->execute([$title, $description, $category, $priority, $_SESSION['user_id']]);

send_response(201, [
    'message' => 'Ticket submitted',
    'ticket' => [
        'id' => $pdo->lastInsertId(),
        'title' => $title,
        'description' => $description,
        'category' => $category,
        'priority' => $priority,
        'status' => 'open'
    ]
]);
