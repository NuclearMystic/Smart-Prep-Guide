<?php
include 'db.php';

$name = $_POST['name'];
$unitPrefix = $_POST['unit_prefix'];
$isFrozen = $_POST['is_frozen'] === 'true' ? 1 : 0;

$sql = "INSERT INTO prep_items (name, unit_prefix, is_frozen) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $name, $unitPrefix, $isFrozen);

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
