<?php
session_start();
include "../db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $_POST['title'];
    $date = $_POST['date'];
    $description = $_POST['description'];
    $sql = "INSERT INTO notifications (title, description, event_date) VALUES ('$title','$description','$date')";
    if (mysqli_query($conn, $sql)) {
        $username = $_SESSION["username"];
        $sql = "INSERT INTO activity_logs (username, action) VALUES ('$username','Added a new notification')";
        mysqli_query($conn, $sql);
        echo json_encode(["status" => "success", "message" => "Notification added successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to add notification"]);
    }
}
