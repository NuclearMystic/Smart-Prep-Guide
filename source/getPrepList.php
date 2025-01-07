<?php
include 'db.php';

header('Content-Type: application/json');

try {
    // Query to fetch all rows from the prep_list table
    $sql = "SELECT * FROM prep_list";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Database query failed: " . $conn->error);
    }

    $prepList = [];
    while ($row = $result->fetch_assoc()) {
        // Map the result to ensure proper data handling
        $prepList[] = [
            'id' => (int)$row['id'], // Cast ID to integer
            'name' => $row['name'],
            'unit_prefix' => $row['unit_prefix'],
            'quantity' => (float)$row['quantity'], // Cast quantity to float
            'is_frozen' => (bool)$row['is_frozen'], // Convert to boolean
        ];
    }

    // Send the result as JSON
    echo json_encode($prepList, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    // Return an error response with an appropriate HTTP code
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    // Ensure the database connection is closed
    $conn->close();
}
