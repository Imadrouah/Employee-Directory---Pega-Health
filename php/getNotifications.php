<?php
include('db.php');

$query = "SELECT * FROM notifications ORDER BY event_date ASC LIMIT 10";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) == 0) {
    echo json_encode(["status" => 0, "message" => "No notifications found."]);
} else {
    $data = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = array(
            "id" => $row["id"],
            "title" => $row["title"],
            "description" => $row["description"],
            "date" => $row["event_date"]
        );
    }
    echo json_encode(["status" => 1, "data" => $data]);
}

mysqli_close($conn);
