<?php
include('db.php');

$query = "SELECT id, username, role FROM users ORDER BY created_at ASC";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) == 0) {
    echo json_encode(["status" => 0, "message" => "No users found."]);
} else {
    $data = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = array(
            "id" => $row["id"],
            "username" => $row["username"],
            "role" => $row["role"]
        );
    }
    echo json_encode(["status" => 1, "data" => $data]);
}

mysqli_close($conn);
