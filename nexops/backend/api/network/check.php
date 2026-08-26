<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

require_role(['admin']);

// Pings every device in the network_devices table and records whether it responded.
// On Railway or any Linux host, the ping command works the same way.

$devices = $pdo->query('SELECT id, ip_address FROM network_devices')->fetchAll(PDO::FETCH_ASSOC);

$update = $pdo->prepare('
    UPDATE network_devices
    SET last_status = ?, last_checked = NOW()
    WHERE id = ?
');

$results = [];

foreach ($devices as $device) {
    $ip = escapeshellarg($device['ip_address']);
    $output = [];
    $return_code = 0;

    exec("ping -c 1 -W 2 $ip", $output, $return_code);
    $status = $return_code === 0 ? 'online' : 'offline';

    $update->execute([$status, $device['id']]);
    $results[] = ['id' => $device['id'], 'status' => $status];
}

send_response(200, ['message' => 'Check complete', 'results' => $results]);
