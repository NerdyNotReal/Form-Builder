<?php
session_start();
include('../db.php');

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$elementId = $data['elementId'] ?? null;
$formId = $data['formId'] ?? null;

if (!$elementId || !$formId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Element ID and Form ID are required']);
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
    echo json_encode(['success' => false, 'error' => 'Access denied']);
    exit;
}

// Delete the form element
$deleteSql = "DELETE FROM form_elements WHERE id = ? AND form_id = ?";
$stmt = mysqli_prepare($conn, $deleteSql);
mysqli_stmt_bind_param($stmt, "ii", $elementId, $formId);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to delete form element']);
}

mysqli_close($conn); 