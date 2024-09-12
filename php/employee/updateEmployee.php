<?php
session_start();
include('../db.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $position = $_POST['position'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $skills = $_POST['skills'];

    $sql = "UPDATE employees SET name = '$name', position = '$position', email = '$email', phone = '$phone', skills = '$skills' WHERE id = '$id'";

    if (mysqli_query($conn, $sql)) {
        $username = $_SESSION["username"];
        $sql = "INSERT INTO activity_logs (username, action) VALUES ('$username','Updated an employee')";
        mysqli_query($conn, $sql);
        echo json_encode(["status" => "success", "message" => "Employee updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update employee"]);
    }
}
