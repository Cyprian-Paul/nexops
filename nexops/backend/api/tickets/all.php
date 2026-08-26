<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

require_role(['admin']);

$stmt = $pdo->query('
    SELECT t.id, t.title, t.description, t.category, t.priority, t.status,
           t.created_at, t.updated_at,
           u.name AS created_by_name,
           a.name AS assigned_to_name
    FROM tickets t
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN users a ON t.assigned_to = a.id
    ORDER BY t.created_at DESC
');

$tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

send_response(200, ['tickets' => $tickets]);
