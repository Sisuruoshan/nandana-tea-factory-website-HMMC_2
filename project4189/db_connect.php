

<?php

$servername = "localhost";
$username = "root";  // default in XAMPP
$password = "";      // leave empty unless you set one
$dbname = "nandana_tea_factory";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
