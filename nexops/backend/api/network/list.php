<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

require_role(['admin']);

$stmt = $pdo->query('
    SELECT id, device_name, ip_address, device_type, last_status, last_checked
    FROM network_devices
    ORDER BY device_name ASC
');

$devices = $stmt->fetchAll(PDO::FETCH_ASSOC);

send_response(200, ['devices' => $devices]);
