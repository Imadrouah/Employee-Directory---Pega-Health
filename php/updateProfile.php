<?php
session_start();
include('db.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_SESSION["user_id"];
    $username = $_POST['username'];
    $oldPassword = $_POST['oldPassword'];
    $password = $_POST['password'];

    if ($password == null) {
        $sql = "UPDATE users SET username='$username' WHERE id='$id'";
        if (mysqli_query($conn, $sql)) {
            $_SESSION['username'] = $username;
            echo json_encode(["status" => "success", "message" => "profile updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update profile"]);
        }
        exit();
    }

    $sql = "SELECT * FROM users  WHERE id='$id'";
    $res = mysqli_query($conn, $sql);

    if (mysqli_num_rows($res) > 0) {
        $user = mysqli_fetch_assoc($res);
        if (password_verify($oldPassword, $user['password'])) {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $sql = "UPDATE users SET username='$username', password='$hashed_password' WHERE id='$id'";

            if (mysqli_query($conn, $sql)) {
                echo json_encode(["status" => "success", "message" => "profile updated successfully"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to update profile"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Wrong old password"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
}
