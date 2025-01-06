<?php
include 'db.php';

$name = $_POST['name'];
$unitPrefix = $_POST['unit_prefix'];
$quantity = $_POST['quantity'];

// Debug: Log the received data
error_log("Name: $name, Unit Prefix: $unitPrefix, Quantity: $quantity");

$sql = "INSERT INTO prep_list (name, unit_prefix, quantity) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssd", $name, $unitPrefix, $quantity);

$response = [];
if ($stmt->execute()) {
    $response['success'] = true;
    $response['id'] = $stmt->insert_id;
} else {
    $response['success'] = false;
    $response['error'] = $stmt->error; // Debug: Capture the SQL error
}

// Debug: Log the response
error_log("Response: " . json_encode($response));

header('Content-Type: application/json');
echo json_encode($response);
?>
