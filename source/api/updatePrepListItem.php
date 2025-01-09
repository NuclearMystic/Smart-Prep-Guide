<?php
include 'db.php';

header('Content-Type: application/json');

// Retrieve the POST data
$id = $_POST['id'] ?? null;
$quantity = $_POST['quantity'] ?? null;

// Validate the inputs
if (!$id || !is_numeric($id) || !$quantity || !is_numeric($quantity)) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

// Prepare and execute the update query
$sql = "UPDATE prep_list SET quantity = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("SQL prepare error: " . $conn->error);
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
    exit;
}

$stmt->bind_param("di", $quantity, $id);

$response = [];
if ($stmt->execute()) {
    $response['success'] = true;
} else {
    error_log("SQL execution error: " . $stmt->error);
    $response['success'] = false;
    $response['message'] = 'Failed to execute statement';
}

// Return the response
echo json_encode($response);

// Clean up resources
$stmt->close();
$conn->close();
?>
