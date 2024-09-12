<?php
include('db.php');

$query = "SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 5";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) == 0) {
    echo json_encode(["status" => 0, "message" => "No activity logs found."]);
} else {
    $data = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = array(
            "id" => $row["id"],
            "username" => $row["username"],
            "action" => $row["action"],
            "timestamp" => $row["created_at"]
        );
    }
    echo json_encode(["status" => 1, "data" => $data]);
}

mysqli_close($conn);
