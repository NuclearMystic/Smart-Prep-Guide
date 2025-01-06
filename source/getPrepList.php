<?php
include 'db.php';

$sql = "SELECT * FROM prep_list";
$result = $conn->query($sql);

$prepList = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $prepList[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($prepList);
?>
