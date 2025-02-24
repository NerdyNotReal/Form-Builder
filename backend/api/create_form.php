<?php
session_start();
include('../db.php');

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

$userId = $_SESSION['user_id'];
$workspaceId = mysqli_real_escape_string($conn, $_POST['workspaceId']);
$title = mysqli_real_escape_string($conn, $_POST['formTitle']);
$description = mysqli_real_escape_string($conn, $_POST['formDescription']);

// Verify workspace exists and user has access
$sql = "SELECT id FROM workspaces WHERE id = '$workspaceId' AND owner_id = '$userId'";
$result = mysqli_query($conn, $sql);

if (!$result || mysqli_num_rows($result) === 0) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Access denied']);
    exit();
}

$sql = "INSERT INTO forms (workspace_id, title, description, owner_id, status) VALUES ('$workspaceId', '$title', '$description', '$userId', 'draft')";

if (mysqli_query($conn, $sql)) {
    $formId = mysqli_insert_id($conn);
    echo json_encode([
        'success' => true,
        'message' => 'Form created successfully',
        'form' => [
            'id' => $formId,
            'title' => $title,
            'description' => $description,
            'status' => 'draft',
            'created_at' => date('Y-m-d H:i:s')
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to create form: ' . mysqli_error($conn)
    ]);
}

mysqli_close($conn); 