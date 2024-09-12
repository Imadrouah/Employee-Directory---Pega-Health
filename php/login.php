<?php
session_start();
include 'db.php';

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE username = '$username'";
$res = mysqli_query($conn, $sql);

if (mysqli_num_rows($res) > 0) {
    $user = mysqli_fetch_assoc($res);
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user["id"];
        $_SESSION['username'] = $username;
        $_SESSION['role'] = $user["role"];
        echo json_encode(["status" => 1]);
    } else {
        echo json_encode(["status" => 0, "details" => "Invalid username or password"]);
    }
} else {
    echo json_encode(["status" => 0, "details" => "Invalid username or password"]);
}

mysqli_close($conn);
