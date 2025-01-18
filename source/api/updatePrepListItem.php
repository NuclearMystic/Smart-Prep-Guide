<?php
include 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow requests from other devices on the network
header('Access-Control-Allow-Methods: POST'); // Restrict to POST requests
header('Access-Control-Allow-Headers: Content-Type'); // Support JSON input

// Retrieve and sanitize the POST data
$id = $_POST['id'] ?? null;
$quantity = $_POST['quantity'] ?? null;

// Validate the inputs
if (!isset($id, $quantity) || !is_numeric($id) || !is_numeric($quantity)) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid input: ID and quantity must be numeric']);
    exit;
}

// Prepare and execute the update query
try {
    $sql = "UPDATE prep_list SET quantity = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    $stmt->bind_param("di", $quantity, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception("Failed to execute statement: " . $stmt->error);
    }
} catch (Exception $e) {
    // Log the error and send a generic error message
    error_log("Error in updatePrepListItem.php: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'An error occurred while updating the prep list item']);
} finally {
    // Clean up resources
    if (isset($stmt) && $stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    $conn->close();
}
?>
