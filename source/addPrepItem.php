<?php
include 'db.php';

header('Content-Type: application/json');

$response = [];

// Validate and sanitize inputs
$name = isset($_POST['name']) ? trim($_POST['name']) : null;
$unitPrefix = isset($_POST['unit_prefix']) ? trim($_POST['unit_prefix']) : '';
$isFrozen = isset($_POST['is_frozen']) && $_POST['is_frozen'] === 'true' ? 1 : 0;

if (empty($name)) {
    $response['success'] = false;
    $response['error'] = 'Name is required.';
    echo json_encode($response);
    exit;
}

$sql = "INSERT INTO prep_items (name, unit_prefix, is_frozen) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    $response['success'] = false;
    $response['error'] = "Prepare failed: " . $conn->error;
    echo json_encode($response);
    exit;
}

$stmt->bind_param("ssi", $name, $unitPrefix, $isFrozen);

if ($stmt->execute()) {
    $response['success'] = true;
    $response['id'] = $stmt->insert_id;
} else {
    $response['success'] = false;
    $response['error'] = "Execute failed: " . $stmt->error;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
