<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

require_role(['admin']);

$stmt = $pdo->query('
    SELECT a.id, a.asset_name, a.asset_type, a.status, a.notes, a.created_at,
           u.name AS assigned_to_name, u.id AS assigned_to_id
    FROM assets a
    LEFT JOIN users u ON a.assigned_to = u.id
    ORDER BY a.created_at DESC
');

$assets = $stmt->fetchAll(PDO::FETCH_ASSOC);

send_response(200, ['assets' => $assets]);
