<?php
require_once __DIR__ . '/../../utils/response.php';

session_start();
session_destroy();

send_response(200, ['message' => 'Logged out']);
