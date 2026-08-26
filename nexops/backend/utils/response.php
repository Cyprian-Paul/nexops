<?php
// Shared helper so every endpoint sends the same JSON shape

// CORS headers, needed since the frontend and backend run on different domains
// during local development, and may also run on different domains once deployed.
$allowed_origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $allowed_origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Browsers send a preflight OPTIONS request before the real one, just confirm and stop here
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

function send_response($status_code, $data) {
    http_response_code($status_code);
    echo json_encode($data);
    exit;
}

function require_role($allowed_roles) {
    session_start();
    if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], $allowed_roles)) {
        send_response(403, ['error' => 'Access denied']);
    }
}
