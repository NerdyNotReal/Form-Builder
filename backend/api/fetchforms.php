<?php
session_start();
require '../db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT id, title, description FROM forms WHERE owner_id = '$user_id'";
$result = mysqli_query($conn, $sql);

if ($result) {
    $forms = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $forms[] = $row;
    }
    echo json_encode($forms);
} else {
    echo json_encode([]);
}
?>
