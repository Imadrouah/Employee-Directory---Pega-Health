<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['logged_in' => false]);
    exit();
}

if (isset($_SESSION['role']) && $_SESSION['role'] !== 'admin') {
    echo json_encode(['logged_in' => true, "username" => $_SESSION["username"], "role" => $_SESSION['role']]);
    exit();
}

echo json_encode(['logged_in' => true, "username" => $_SESSION["username"], "role" => $_SESSION['role']]);
