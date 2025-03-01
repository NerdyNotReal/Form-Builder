<?php
session_start();
include('../db.php');

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$formId = isset($_GET['id']) ? $_GET['id'] : null;

if (!$formId) {
    http_response_code(400);
    echo json_encode(['error' => 'Form ID is required']);
    exit;
}

// Verify user has access to this form
$formSql = "SELECT id FROM forms WHERE id = ? AND owner_id = ?";
$stmt = mysqli_prepare($conn, $formSql);
mysqli_stmt_bind_param($stmt, "ii", $formId, $_SESSION['user_id']);
mysqli_stmt_execute($stmt);
$formResult = mysqli_stmt_get_result($stmt);

if (!mysqli_fetch_assoc($formResult)) {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied']);
    exit;
}

// Get form elements
$elementsSql = "SELECT * FROM form_elements WHERE form_id = ? ORDER BY position";
$stmt = mysqli_prepare($conn, $elementsSql);
mysqli_stmt_bind_param($stmt, "i", $formId);
mysqli_stmt_execute($stmt);
$elementsResult = mysqli_stmt_get_result($stmt);

$elements = [];
while ($row = mysqli_fetch_assoc($elementsResult)) {
    $elements[] = [
        'id' => $row['id'],
        'type' => $row['element_type'],
        'label' => $row['label'],
        'required' => (bool)$row['is_required'],
        'position' => $row['position'],
        'properties' => json_decode($row['properties'], true)
    ];
}

echo json_encode([
    'success' => true,
    'elements' => $elements
]);

mysqli_close($conn); 