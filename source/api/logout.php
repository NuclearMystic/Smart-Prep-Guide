<?php
session_start(); // Start the session

// Destroy all session data
session_unset();
session_destroy();

// Redirect to the login page
header('Content-Type: text/html'); // Specify content type for the response
header('Location: /index.html'); // Redirect to the login page
exit;
?>
