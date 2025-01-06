<?php
include 'db.php';

// Decode the JSON input
$ids = json_decode(file_get_contents('php://input'), true);

// Validate the input
if (!is_array($ids) || empty($ids)) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

// Construct the query with placeholders
$idPlaceholders = implode(',', array_fill(0, count($ids), '?'));
$sql = "DELETE FROM prep_items WHERE id IN ($idPlaceholders)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500); // Internal server error
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
    exit;
}

// Bind parameters dynamically
$types = str_repeat('i', count($ids)); // 'i' for integer types
$stmt->bind_param($types, ...$ids);

// Execute and send the response
$response = ['success' => $stmt->execute()];
if (!$response['success']) {
    $response['error'] = $stmt->error; // Include error details for debugging
}

header('Content-Type: application/json');
echo json_encode($response);
?>
