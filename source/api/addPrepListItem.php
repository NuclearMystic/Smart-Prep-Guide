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
$quantity = isset($_POST['quantity']) && is_numeric($_POST['quantity']) ? (float)$_POST['quantity'] : null;
$isFrozen = isset($_POST['is_frozen']) && $_POST['is_frozen'] === '1' ? 1 : 0;

if (empty($name) || $quantity === null) {
    $response['success'] = false;
    $response['error'] = 'Name and quantity are required.';
    echo json_encode($response);
    exit;
}

// Use a try-catch block for better error handling
try {
    // Prepare the SQL statement
    $sql = "INSERT INTO prep_list (name, unit_prefix, quantity, is_frozen) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ssdi", $name, $unitPrefix, $quantity, $isFrozen);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['id'] = $stmt->insert_id; // Return the ID of the inserted row
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    // Close the statement
    $stmt->close();
} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

// Close the connection
$conn->close();

// Return the response as JSON
echo json_encode($response);
?>
