<?php
require 'db.php';
require 'helpers.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? ''; // Fixed missing bracket
    $confirm_password = $_POST['confirm_password'] ?? '';

    // validate empty fields 
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }
    //username validation
    $usernameValidation = isValidUsername($username);
    // if (!$usernameValidation['valid']) {
    //     echo json_encode(["success" => false, "message" => $usernameValidation['message']]);
    //     exit;
    // }

    // check if username already taken by other user
    if (isUsernameTaken($conn, $username)) {
        echo json_encode(["success" => false, "message" => "Username is already taken."]);
        exit;
    }

    // check if passwrord maches
    if ($password !== $confirm_password) {
        echo json_encode(["success" => false, "message" => "Passwords do not match."]);
        exit;
    }

    // Email validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Invalid email format."]);
        exit;
    }

    //sanitize inputs for better security
    $username = mysqli_real_escape_string($conn, $username);
    $email = mysqli_real_escape_string($conn, $email);
    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    // insert user in database
    $sql = "INSERT INTO users (username, email, password_hash) VALUES ('$username', '$email', '$password_hash')";

    if (mysqli_query($conn, $sql)) {
        echo json_encode(["success" => true, "message" => "User registered successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error: " . mysqli_error($conn)]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>