<?php
session_start();
include('../db.php');
header('Content-Type: application/json'); // for json response


$userid = $_SESSION['user_id'];
$sql = "SELECT * FROM forms Where owner_id = '$userid'";
if (mysqli_query($conn, $sql)) {
    $result = mysqli_query($conn, $sql);
    $forms = [];
    
    $_SESSION['form_title'] = $row['title'];
    while ($row = mysqli_fetch_assoc($result)) {
        $forms[] = $row;
    }

    echo json_encode($forms);
}



?>

