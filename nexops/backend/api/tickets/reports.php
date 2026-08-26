<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../utils/response.php';

require_role(['admin']);

// Total tickets by status
$by_status = $pdo->query('
    SELECT status, COUNT(*) AS total
    FROM tickets
    GROUP BY status
')->fetchAll(PDO::FETCH_ASSOC);

// Total tickets by priority
$by_priority = $pdo->query('
    SELECT priority, COUNT(*) AS total
    FROM tickets
    GROUP BY priority
')->fetchAll(PDO::FETCH_ASSOC);

// Most common categories
$by_category = $pdo->query('
    SELECT COALESCE(category, "Uncategorized") AS category, COUNT(*) AS total
    FROM tickets
    GROUP BY category
    ORDER BY total DESC
    LIMIT 10
')->fetchAll(PDO::FETCH_ASSOC);

// Average resolution time in hours, only for resolved or closed tickets
$avg_resolution = $pdo->query('
    SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) AS avg_hours
    FROM tickets
    WHERE status IN ("resolved", "closed")
')->fetch(PDO::FETCH_ASSOC);

// Ticket volume over the last 7 days
$volume_7_days = $pdo->query('
    SELECT DATE(created_at) AS day, COUNT(*) AS total
    FROM tickets
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY DATE(created_at)
    ORDER BY day ASC
')->fetchAll(PDO::FETCH_ASSOC);

send_response(200, [
    'by_status' => $by_status,
    'by_priority' => $by_priority,
    'by_category' => $by_category,
    'avg_resolution_hours' => round($avg_resolution['avg_hours'] ?? 0, 1),
    'volume_last_7_days' => $volume_7_days
]);
