<?php 
session_start();

include('../db.php');

header('Content-Type: application/json'); //for  json response

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userid = $_SESSION['user_id']; 
    $title = $_POST['formTitle']; 
    $description = $_POST['formDescription']; 

    $title = mysqli_real_escape_string($conn, $title);
    $description = mysqli_real_escape_string($conn, $description);

    $sql =  "INSERT INTO forms (title, description, owner_id) VALUES ('$title', '$description', '$userid')";
    
    if (mysqli_query($conn, $sql)) {
        $response = [
            'id' => $userid,
            'success' => true,
            'message' => 'Form created successfully!',
            'title' => $title,
            'description' => $description
        ];
    } else {
        $response = [
            'success' => true,
            'message' => 'Form created successfully!',
            'title' => $title,
            'description' => $description
        ];
    }

    echo json_encode($response);
}
?>