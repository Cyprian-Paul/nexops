<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

require_role(['admin']);

$data = json_decode(file_get_contents('php://input'), true);

$device_name = trim($data['device_name'] ?? '');
$ip_address = trim($data['ip_address'] ?? '');
$device_type = trim($data['device_type'] ?? '');

if (!$device_name || !$ip_address) {
    send_response(400, ['error' => 'Device name and IP address are required']);
}

$stmt = $pdo->prepare('
    INSERT INTO network_devices (device_name, ip_address, device_type)
    VALUES (?, ?, ?)
');
$stmt->execute([$device_name, $ip_address, $device_type]);

send_response(201, [
    'message' => 'Device added',
    'device' => [
        'id' => $pdo->lastInsertId(),
        'device_name' => $device_name,
        'ip_address' => $ip_address,
        'device_type' => $device_type,
        'last_status' => 'unknown'
    ]
]);
