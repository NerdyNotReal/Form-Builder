<?php 
$host = "localhost";
$username = "root";
$password = "";
$dbname = "auth_system";

$conn = mysqli_connect($host, $username, $password, $dbname);

if (!$conn) {
    die ("Database connection failed: ". mysqli_connect_error());
}
?>