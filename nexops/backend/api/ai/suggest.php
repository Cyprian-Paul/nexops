<?php
require_once __DIR__ . '/../../utils/response.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    send_response(401, ['error' => 'Not logged in']);
}

$data = json_decode(file_get_contents('php://input'), true);

$title = trim($data['title'] ?? '');
$description = trim($data['description'] ?? '');

if (!$title || !$description) {
    send_response(400, ['error' => 'Title and description are required']);
}

$api_key = getenv('GEMINI_API_KEY');

if (!$api_key) {
    send_response(500, ['error' => 'AI assistant is not configured']);
}

$prompt = "You are helping an IT support system sort a new ticket. "
    . "Read the ticket below and respond with only two lines, nothing else.\n"
    . "Line 1: Category (choose one word or short phrase, for example Network, Hardware, Access, Software, Email)\n"
    . "Line 2: Priority (choose exactly one of: low, medium, high, urgent)\n\n"
    . "Ticket title: $title\n"
    . "Ticket description: $description";

$payload = json_encode([
    'contents' => [
        ['parts' => [['text' => $prompt]]]
    ]
]);

$url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . $api_key;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    send_response(200, ['category' => 'Uncategorized', 'priority' => 'medium', 'ai_used' => false]);
}

$result = json_decode($response, true);
$text = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';

$lines = array_filter(array_map('trim', explode("\n", $text)));
$lines = array_values($lines);

$category = $lines[0] ?? 'Uncategorized';
$priority_raw = strtolower($lines[1] ?? 'medium');

$priority = in_array($priority_raw, ['low', 'medium', 'high', 'urgent']) ? $priority_raw : 'medium';

send_response(200, [
    'category' => $category,
    'priority' => $priority,
    'ai_used' => true
]);
