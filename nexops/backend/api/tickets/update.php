<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

require_role(['admin']);

$data = json_decode(file_get_contents('php://input'), true);

$ticket_id = $data['id'] ?? null;

if (!$ticket_id) {
    send_response(400, ['error' => 'Ticket id is required']);
}

$check = $pdo->prepare('SELECT id FROM tickets WHERE id = ?');
$check->execute([$ticket_id]);
if (!$check->fetch()) {
    send_response(404, ['error' => 'Ticket not found']);
}

$fields = [];
$values = [];

if (isset($data['status'])) {
    if (!in_array($data['status'], ['open', 'in_progress', 'resolved', 'closed'])) {
        send_response(400, ['error' => 'Invalid status']);
    }
    $fields[] = 'status = ?';
    $values[] = $data['status'];
}

if (isset($data['priority'])) {
    if (!in_array($data['priority'], ['low', 'medium', 'high', 'urgent'])) {
        send_response(400, ['error' => 'Invalid priority']);
    }
    $fields[] = 'priority = ?';
    $values[] = $data['priority'];
}

if (isset($data['assigned_to'])) {
    $fields[] = 'assigned_to = ?';
    $values[] = $data['assigned_to'];
}

if (isset($data['category'])) {
    $fields[] = 'category = ?';
    $values[] = $data['category'];
}

if (empty($fields)) {
    send_response(400, ['error' => 'No changes provided']);
}

$values[] = $ticket_id;

$sql = 'UPDATE tickets SET ' . implode(', ', $fields) . ' WHERE id = ?';
$stmt = $pdo->prepare($sql);
$stmt->execute($values);

send_response(200, ['message' => 'Ticket updated']);
