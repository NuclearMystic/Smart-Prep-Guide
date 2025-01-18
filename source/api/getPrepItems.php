<?php
include 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow requests from other devices on the network
header('Access-Control-Allow-Methods: GET'); // Restrict to GET requests

try {
    // Query to fetch all rows from the prep_items table
    $sql = "SELECT * FROM prep_items";
    $result = $conn->query($sql);

    if (!$result) {
        // Log error and throw exception
        error_log("Database query failed: " . $conn->error);
        throw new Exception("Database query failed");
    }

    $prepItems = [];
    while ($row = $result->fetch_assoc()) {
        // Map the result to ensure proper data handling
        $prepItems[] = [
            'id' => (int)$row['id'], // Cast ID to integer
            'name' => $row['name'],
            'unit_prefix' => $row['unit_prefix'] ?? '', // Default to empty string if null
            'is_frozen' => (bool)$row['is_frozen'], // Convert to boolean
        ];
    }

    // Send the result as JSON
    echo json_encode($prepItems, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
} catch (Exception $e) {
    // Log the error and return a generic error message
    error_log("Error in getPrepItems.php: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "An error occurred while fetching prep items."]);
} finally {
    // Ensure the database connection is closed
    $conn->close();
}
?>
