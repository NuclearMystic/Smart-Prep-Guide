<?php
include 'db.php';

header('Content-Type: application/json');

try {
    // Fetch all rows from the prep_list table
    $sql = "SELECT * FROM prep_list";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Database query failed: " . $conn->error);
    }

    $prepList = [];
    while ($row = $result->fetch_assoc()) {
        $prepList[] = $row;
    }

    // Return the result as JSON
    echo json_encode($prepList, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    // Handle errors gracefully
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => $e->getMessage()]);
}
?>
