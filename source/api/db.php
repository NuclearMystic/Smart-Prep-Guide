<?php
// Database configuration
$servername = "localhost"; // Change to your laptop's IP if accessed from other devices
$username = "root";
$password = ""; // Ensure this is secure if deploying online
$dbname = "smart_prep_guide";
$port = 3306; // Updated to default MySQL port for local setup

// Establish a connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check for connection errors
if ($conn->connect_error) {
    // Log the error for debugging (avoid exposing sensitive info in production)
    error_log("Database connection failed: " . $conn->connect_error);
    die("Database connection failed. Please try again later."); // Avoid exposing details to users
}

// Set character set to UTF-8 for compatibility
if (!$conn->set_charset("utf8mb4")) { // Use utf8mb4 for better support (e.g., emojis)
    error_log("Error loading character set utf8mb4: " . $conn->error);
    die("Failed to set database character set.");
}

// Enable strict SQL mode for better error handling (optional but recommended)
if (!$conn->query("SET SESSION sql_mode = 'STRICT_ALL_TABLES'")) {
    error_log("Failed to set strict SQL mode: " . $conn->error);
}
?>
