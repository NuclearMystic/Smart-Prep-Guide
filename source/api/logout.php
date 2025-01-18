<?php
session_start(); // Start the session

// Ensure secure session destruction
if (session_status() === PHP_SESSION_ACTIVE) {
    // Unset all session variables
    $_SESSION = [];

    // Delete the session cookie (if it exists)
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000, // Expire the cookie
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    // Destroy the session
    session_destroy();
}

// Redirect to the login page
header('Content-Type: text/html'); // Specify content type for the response
header('Location: /index.html'); // Redirect to the login page
exit;
?>
