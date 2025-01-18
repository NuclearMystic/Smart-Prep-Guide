<?php
include 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow requests from other devices on the network
header('Access-Control-Allow-Methods: POST'); // Only allow POST requests
header('Access-Control-Allow-Headers: Content-Type'); // Support JSON input

try {
    // Decode the JSON input
    $input = file_get_contents('php://input');
    $ids = json_decode($input, true);

    // Validate the input
    if (!is_array($ids) || empty($ids) || !array_filter($ids, 'is_numeric')) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Invalid input. Expected an array of numeric IDs.']);
        exit;
    }

    // Construct the query with placeholders
    $idPlaceholders = implode(',', array_fill(0, count($ids), '?'));
    $sql = "DELETE FROM prep_items WHERE id IN ($idPlaceholders)";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $conn->error);
    }

    // Bind parameters dynamically
    $types = str_repeat('i', count($ids)); // 'i' for integer types
    $stmt->bind_param($types, ...array_map('intval', $ids));

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'deleted_count' => $stmt->affected_rows]);
    } else {
        throw new Exception('Execution failed: ' . $stmt->error);
    }
} catch (Exception $e) {
    // Log the error and send a generic response
    error_log('Error in deletePrepItems.php: ' . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'An error occurred while deleting items.']);
} finally {
    // Clean up resources
    if (isset($stmt) && $stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    $conn->close();
}
?>
