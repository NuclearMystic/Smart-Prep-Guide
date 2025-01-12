<?php
include 'db.php';

header('Content-Type: application/json');

// Decode the incoming JSON input
$id = json_decode(file_get_contents('php://input'), true);

if (!isset($id) || !is_numeric($id)) { // Validate input
    // Invalid or missing ID
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid ID']);
    exit;
}

$sql = "DELETE FROM prep_list WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    // Log the error for debugging
    error_log("Failed to prepare SQL statement: " . $conn->error);
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Failed to prepare SQL statement']);
    exit;
}

// Bind the parameter and execute the statement
$stmt->bind_param("i", $id);
$response = ['success' => $stmt->execute()];

if (!$response['success']) {
    // Log error if execution fails
    error_log("SQL Execution Error: " . $stmt->error);
    $response['error'] = $stmt->error;
}

// Return the response as JSON
echo json_encode($response);

// Clean up resources
$stmt->close();
$conn->close();
?>
