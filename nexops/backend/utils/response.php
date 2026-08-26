<?php
// Shared helper so every endpoint sends the same JSON shape

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
