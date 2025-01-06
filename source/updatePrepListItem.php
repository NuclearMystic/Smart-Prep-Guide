<?php
include 'db.php';

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
$stmt->bind_param("di", $quantity, $id);

$response = [];
if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['success'] = false;
    $response['message'] = $stmt->error;
}

header('Content-Type: application/json');
echo json_encode($response);
?>
