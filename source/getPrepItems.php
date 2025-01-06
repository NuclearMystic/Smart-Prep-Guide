<?php
include 'db.php'; // Ensure this includes your database connection setup

$sql = "SELECT * FROM prep_items";
$result = $conn->query($sql);

$prepItems = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $prepItems[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($prepItems);
?>
