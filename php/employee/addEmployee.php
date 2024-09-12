<?php
session_start();
include "../db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $position = $_POST['position'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $skills = $_POST['skills'];


    $sql = "INSERT INTO employees (name, position, email, phone, skills) VALUES ('$name', '$position', '$email', '$phone', '$skills')";

    if (mysqli_query($conn, $sql)) {
        $username = $_SESSION["username"];
        $sql = "INSERT INTO activity_logs (username, action) VALUES ('$username','Added a new employee: $name')";
        mysqli_query($conn, $sql);
        echo json_encode(["status" => "success", "message" => "Employee added successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to add employee"]);
    }
}
