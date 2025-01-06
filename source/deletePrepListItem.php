<?php
include 'db.php';

$id = json_decode(file_get_contents('php://input'), true);

$sql = "DELETE FROM prep_list WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

$response = ['success' => $stmt->execute()];
header('Content-Type: application/json');
echo json_encode($response);
?>
