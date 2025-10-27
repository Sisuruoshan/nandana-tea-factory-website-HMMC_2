<?php
include 'nandana_tea_factory.php';

// Get email and password//
$email = $_POST['email'];
$password = $_POST['password'];



// Encrypt the password before saving//
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);



// Save to database//

$sql = "INSERT INTO wholesale_users (email, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $hashedPassword);

if ($stmt->execute()) {
    echo "Registration successful!";
} 

else {
    echo "Error: " . $conn->error;
}


$stmt->close();
$conn->close();
?>
