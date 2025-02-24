<?php
session_start();
include('../db.php');

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit();
}

$userId = $_SESSION['user_id'];
$workspaceId = mysqli_real_escape_string($conn, $_GET['id']);

// Fetch workspace details
$sql = "SELECT * FROM workspaces WHERE id = '$workspaceId' AND owner_id = '$userId'";
$result = mysqli_query($conn, $sql);

if (!$result || mysqli_num_rows($result) === 0) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Workspace not found']);
    exit();
}

$workspace = mysqli_fetch_assoc($result);

// Fetch forms in this workspace
$sql = "SELECT * FROM forms WHERE workspace_id = '$workspaceId'";
$formsResult = mysqli_query($conn, $sql);

$forms = [];
if ($formsResult) {
    while ($row = mysqli_fetch_assoc($formsResult)) {
        $forms[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'status' => $row['status'],
            'created_at' => $row['created_at']
        ];
    }
}

echo json_encode([
    'success' => true,
    'workspace' => [
        'id' => $workspace['id'],
        'name' => $workspace['name'],
        'title' => $workspace['name'], // For backward compatibility
        'description' => $workspace['description'],
        'created_at' => $workspace['created_at']
    ],
    'forms' => $forms
]);

mysqli_close($conn); 