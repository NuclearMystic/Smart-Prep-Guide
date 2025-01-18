<?php
include 'db.php';

session_start(); // Start the session

// Enhance session security
ini_set('session.cookie_secure', '1'); // Ensure cookies are sent over HTTPS
ini_set('session.cookie_httponly', '1'); // Prevent JavaScript access to session cookies
ini_set('session.use_strict_mode', '1'); // Reject uninitialized session IDs

// Retrieve and sanitize input
$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

// Handle missing username or password
if (empty($username) || empty($password)) {
    // Redirect back to login page with an error message
    header('Location: ../index.html?error=missing');
    exit;
}

// Query to check the credentials
try {
    $sql = "SELECT id, password FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            // Regenerate session ID to prevent session fixation
            session_regenerate_id(true);

            // Store user ID in session
            $_SESSION['user_id'] = $user['id'];

            // Redirect to the dashboard
            header('Location: ../dashboard.html');
            exit;
        } else {
            // Redirect back to login page with an error message
            header('Location: ../index.html?error=invalid');
            exit;
        }
    } else {
        // Redirect back to login page with an error message
        header('Location: ../index.html?error=invalid');
        exit;
    }
} catch (Exception $e) {
    // Log error for debugging
    error_log("Error in login.php: " . $e->getMessage());
    // Redirect with generic error message
    header('Location: ../index.html?error=server');
    exit;
} finally {
    if (isset($stmt) && $stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    $conn->close();
}
?>
