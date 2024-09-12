<?php
session_start();
include "../db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST["id"];
    $sql = "DELETE FROM employees WHERE id = $id";
    if (mysqli_query($conn, $sql)) {
        $username = $_SESSION["username"];
        $sql = "INSERT INTO activity_logs (username, action) VALUES ('$username','Deleted an employee')";
        mysqli_query($conn, $sql);
        echo json_encode(["status" => "success", "message" => "Employee deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete employee"]);
    }
}
