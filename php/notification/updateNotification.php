<?php
session_start();
include('../db.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $title = $_POST['title'];
    $date = $_POST['date'];
    $description = $_POST['description'];
    $sql = "UPDATE notifications SET title='$title', event_date='$date', description='$description' WHERE id='$id'";

    if (mysqli_query($conn, $sql)) {
        $username = $_SESSION["username"];
        $sql = "INSERT INTO activity_logs (username, action) VALUES ('$username','Updated a notification')";
        mysqli_query($conn, $sql);
        echo json_encode(["status" => "success", "message" => "Notification updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update notification"]);
    }
}
