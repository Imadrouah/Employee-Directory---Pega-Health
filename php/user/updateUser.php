<?php
session_start();
include('../db.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $role = $_POST['role'];

    $_SESSION['username'] = $username;
    $_SESSION['role'] = $role;

    if ($password == null)
        $sql = "UPDATE users SET username='$username', role='$role' WHERE id='$id'";
    else {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $sql = "UPDATE users SET username='$username', password='$hashed_password', role='$role' WHERE id='$id'";
    }

    if (mysqli_query($conn, $sql)) {
        $name = $_SESSION["username"];
        $sql = "INSERT INTO activity_logs (username, action) VALUES ('$name','Updated a user')";
        mysqli_query($conn, $sql);
        echo json_encode(["status" => "success", "message" => "User updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update user"]);
    }
}
