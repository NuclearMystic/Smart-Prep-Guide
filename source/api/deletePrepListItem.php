<?php
include 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow requests from other devices on the network
header('Access-Control-Allow-Methods: POST'); // Restrict to POST requests
header('Access-Control-Allow-Headers: Content-Type'); // Allow JSON content type

try {
    // Decode the incoming JSON input
    $input = file_get_contents('php://input');
    $id = json_decode($input, true);

    // Validate the input
    if (!isset($id) || !is_numeric($id)) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Invalid ID']);
        exit;
    }

    // Prepare the SQL query
    $sql = "DELETE FROM prep_list WHERE id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    // Bind the parameter and execute the statement
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception("SQL Execution Error: " . $stmt->error);
    }
} catch (Exception $e) {
    // Log error and send a generic response
    error_log('Error in deletePrepListItem.php: ' . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'An error occurred while deleting the item.']);
} finally {
    // Clean up resources
    if (isset($stmt) && $stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    $conn->close();
}
?>
