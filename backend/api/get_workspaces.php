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

// Fetch all workspaces owned by the user
$sql = "SELECT * FROM workspaces WHERE owner_id = '$userId' ORDER BY created_at DESC";
$result = mysqli_query($conn, $sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch workspaces']);
    exit();
}

$workspaces = [];
while ($row = mysqli_fetch_assoc($result)) {
    $workspaces[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'description' => $row['description'],
        'created_at' => $row['created_at']
    ];
}

echo json_encode([
    'success' => true,
    'workspaces' => $workspaces
]);

mysqli_close($conn); 