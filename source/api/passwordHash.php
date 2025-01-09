<?php
header('Content-Type: text/plain'); // Output as plain text

$password = '#09Efarnum86'; // Replace with the desired password
echo password_hash($password, PASSWORD_DEFAULT);
?>
