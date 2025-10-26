<?php
include 'db_connect.php';

// Get form data//
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];



// Prepare SQL query//
$sql = "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $name, $email, $subject, $message);

if ($stmt->execute()) 
    {
    echo "Message sent successfully!";
}

else 
    {
    echo "Error: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
