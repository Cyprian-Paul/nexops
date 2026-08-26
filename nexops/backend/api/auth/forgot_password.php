<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');

if (!$email) {
    send_response(400, ['error' => 'Email is required']);
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Always return the same message whether or not the email exists.
// This stops someone from using this form to check which emails are registered.
if (!$user) {
    send_response(200, ['message' => 'If that email exists, a reset link has been sent']);
}

$token = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

$insert = $pdo->prepare('
    INSERT INTO password_resets (user_id, token, expires_at)
    VALUES (?, ?, ?)
');
$insert->execute([$user['id'], $token, $expires_at]);

$reset_link = "https://your-nexops-domain.com/reset-password?token=$token";

// Send the email through Resend. RESEND_API_KEY comes from an environment variable,
// set on Railway the same way GEMINI_API_KEY is set.
$resend_key = getenv('RESEND_API_KEY');

if ($resend_key) {
    $email_payload = json_encode([
        'from' => 'NexOps <onboarding@resend.dev>',
        'to' => [$email],
        'subject' => 'Reset your NexOps password',
        'html' => "<p>Click the link below to reset your password. This link expires in 1 hour.</p>"
            . "<p><a href=\"$reset_link\">$reset_link</a></p>"
    ]);

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $resend_key,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $email_payload);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_exec($ch);
    curl_close($ch);
}

send_response(200, [
    'message' => 'If that email exists, a reset link has been sent'
]);
