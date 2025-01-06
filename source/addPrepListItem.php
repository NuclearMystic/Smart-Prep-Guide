<?php
include 'db.php';

$name = $_POST['name'];
$unitPrefix = $_POST['unit_prefix'];
$quantity = $_POST['quantity'];

$sql = "INSERT INTO prep_list (name, unit_prefix, quantity) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssd", $name, $unitPrefix, $quantity);

$response = [];
if ($stmt->execute()) {
    $response['success'] = true;
    $response['id'] = $stmt->insert_id;
} else {
    $response['success'] = false;
}

header('Content-Type: application/json');
echo json_encode($response);
?>
