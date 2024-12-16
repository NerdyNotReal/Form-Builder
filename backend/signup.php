<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);
    $confirm_password = mysqli_real_escape_string($conn, $_POST['confirm_password']);

    // Validation
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        die("All fields are required.");
    }

    if ($password !== $confirm_password) {
        die("Passwords do not match.");
    }

    // Hash the password
    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    // Insert user into the database
    $sql = "INSERT INTO users (username, email, password_hash) VALUES ('$username', '$email', '$password_hash')";

    if (mysqli_query($conn, $sql)) {
        echo "User registered successfully.";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>
