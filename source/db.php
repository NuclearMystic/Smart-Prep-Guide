<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smart_prep_guide";

// Establish a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    // Log the error for debugging (avoid displaying sensitive info in production)
    error_log("Database connection failed: " . $conn->connect_error);
    die("Database connection failed. Please try again later.");
}

// Optional: Set character set to UTF-8 for compatibility
if (!$conn->set_charset("utf8")) {
    error_log("Error loading character set utf8: " . $conn->error);
}
?>
