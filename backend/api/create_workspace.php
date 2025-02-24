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
$name = mysqli_real_escape_string($conn, $_POST['workspaceName']);
$description = mysqli_real_escape_string($conn, $_POST['workspaceDescription']);

if (empty($name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Workspace name is required']);
    exit();
}

$sql = "INSERT INTO workspaces (name, description, owner_id, created_at) VALUES ('$name', '$description', '$userId', NOW())";

if (mysqli_query($conn, $sql)) {
    $workspaceId = mysqli_insert_id($conn);
    echo json_encode([
        'success' => true,
        'message' => 'Workspace created successfully',
        'workspace' => [
            'id' => $workspaceId,
            'name' => $name,
            'description' => $description
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to create workspace: ' . mysqli_error($conn)
    ]);
}

mysqli_close($conn);
