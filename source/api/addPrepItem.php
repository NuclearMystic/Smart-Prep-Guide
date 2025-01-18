<?php
include 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow requests from other devices on the local network
header('Access-Control-Allow-Methods: POST'); // Ensure only POST requests are accepted
header('Access-Control-Allow-Headers: Content-Type'); // Allow content-type header

$response = [];

// Validate and sanitize inputs
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : null;
$unitPrefix = isset($_POST['unit_prefix']) ? htmlspecialchars(trim($_POST['unit_prefix'])) : '';
$isFrozen = isset($_POST['is_frozen']) && $_POST['is_frozen'] === 'true' ? 1 : 0;

if (empty($name)) {
    $response['success'] = false;
    $response['error'] = 'Name is required.';
    echo json_encode($response);
    exit;
}

// Use a try-catch block for better error handling
try {
    $sql = "INSERT INTO prep_items (name, unit_prefix, is_frozen) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ssi", $name, $unitPrefix, $isFrozen);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['id'] = $stmt->insert_id;
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

$conn->close();

echo json_encode($response);
?>
