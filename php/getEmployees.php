<?php
include 'db.php';

$query = "SELECT COUNT(*) as total FROM notifications WHERE event_date = CURDATE()";
$result = mysqli_query($conn, $query);
$eventsToday = ($result && mysqli_fetch_assoc($result)['total'] > 0);

$sql = 'SELECT * FROM employees';
$res = mysqli_query($conn, $sql);

if (mysqli_num_rows($res) == 0) {
    echo json_encode(["status" => 0, "message" => "No employees found."]);
} else {
    $employees = [];
    while ($row = mysqli_fetch_assoc($res)) {
        $employees[] = [
            "id" => $row["id"],
            "name" => $row["name"],
            "position" => $row["position"],
            "cin" => $row["cin"],
            "email" => $row["email"],
            "phone" => $row["phone"],
            "skills" => $row["skills"]
        ];
    }
    echo json_encode(["status" => 1, "data" => $employees, "event" => $eventsToday]);
}

mysqli_close($conn);
