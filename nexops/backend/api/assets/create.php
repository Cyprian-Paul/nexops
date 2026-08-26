<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

require_role(['admin']);

$data = json_decode(file_get_contents('php://input'), true);

$asset_name = trim($data['asset_name'] ?? '');
$asset_type = trim($data['asset_type'] ?? '');
$assigned_to = $data['assigned_to'] ?? null;
$notes = trim($data['notes'] ?? '');

if (!$asset_name) {
    send_response(400, ['error' => 'Asset name is required']);
}

$stmt = $pdo->prepare('
    INSERT INTO assets (asset_name, asset_type, assigned_to, status, notes)
    VALUES (?, ?, ?, "active", ?)
');
$stmt->execute([$asset_name, $asset_type, $assigned_to, $notes]);

send_response(201, [
    'message' => 'Asset added',
    'asset' => [
        'id' => $pdo->lastInsertId(),
        'asset_name' => $asset_name,
        'asset_type' => $asset_type,
        'assigned_to' => $assigned_to,
        'status' => 'active',
        'notes' => $notes
    ]
]);
