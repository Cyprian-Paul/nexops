<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

require_role(['admin']);

$data = json_decode(file_get_contents('php://input'), true);

$asset_id = $data['id'] ?? null;

if (!$asset_id) {
    send_response(400, ['error' => 'Asset id is required']);
}

$check = $pdo->prepare('SELECT id FROM assets WHERE id = ?');
$check->execute([$asset_id]);
if (!$check->fetch()) {
    send_response(404, ['error' => 'Asset not found']);
}

$fields = [];
$values = [];

if (array_key_exists('assigned_to', $data)) {
    $fields[] = 'assigned_to = ?';
    $values[] = $data['assigned_to'];
}

if (isset($data['status'])) {
    $fields[] = 'status = ?';
    $values[] = $data['status'];
}

if (isset($data['notes'])) {
    $fields[] = 'notes = ?';
    $values[] = $data['notes'];
}

if (empty($fields)) {
    send_response(400, ['error' => 'No changes provided']);
}

$values[] = $asset_id;

$sql = 'UPDATE assets SET ' . implode(', ', $fields) . ' WHERE id = ?';
$stmt = $pdo->prepare($sql);
$stmt->execute($values);

send_response(200, ['message' => 'Asset updated']);
