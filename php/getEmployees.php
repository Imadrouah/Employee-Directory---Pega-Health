<?php
include 'db.php';

$sql = 'SELECT * FROM employees';
$res = mysqli_query($conn, $sql);


if (mysqli_num_rows($res) == 0) {
    echo json_encode(["status" => 0, "message" => "No employees found."]);
} else {
    $employees = array();
    while ($row = mysqli_fetch_assoc($res)) {
        $employees[] = array(
            "id" => $row["id"],
            "name" => $row["name"],
            "position" => $row["position"],
            "email" => $row["email"],
            "phone" => $row["phone"],
            "skills" => $row["skills"]
        );
    }
    echo json_encode(["status" => 1, "data" => $employees]);
}

mysqli_close($conn);
