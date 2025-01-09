<?php
include 'db.php';

header('Content-Type: application/json');

$response = [];

// Validate and sanitize inputs
$name = isset($_POST['name']) ? trim($_POST['name']) : null;
$unitPrefix = isset($_POST['unit_prefix']) ? trim($_POST['unit_prefix']) : '';
$quantity = isset($_POST['quantity']) && is_numeric($_POST['quantity']) ? (float)$_POST['quantity'] : null;
$isFrozen = isset($_POST['is_frozen']) && $_POST['is_frozen'] === '1' ? 1 : 0;

if (empty($name) || $quantity === null) {
    $response['success'] = false;
    $response['error'] = 'Name and quantity are required.';
    echo json_encode($response);
    exit;
}

// Prepare the SQL statement
$sql = "INSERT INTO prep_list (name, unit_prefix, quantity, is_frozen) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    $response['success'] = false;
    $response['error'] = "Prepare failed: " . $conn->error;
    echo json_encode($response);
    exit;
}

$stmt->bind_param("ssdi", $name, $unitPrefix, $quantity, $isFrozen);

if ($stmt->execute()) {
    $response['success'] = true;
    $response['id'] = $stmt->insert_id; // Return the ID of the inserted row
} else {
    $response['success'] = false;
    $response['error'] = "Execute failed: " . $stmt->error;
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Return the response as JSON
echo json_encode($response);
?>
