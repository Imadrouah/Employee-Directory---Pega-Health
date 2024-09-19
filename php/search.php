<?php
include "db.php";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $query = $_POST["query"];
    if (isset($query)) {

        $sql = "SELECT * FROM employees 
                WHERE name LIKE '$query%' OR 
                position LIKE '$query%' OR 
                cin LIKE '$query%' OR 
                email LIKE '$query%' OR 
                phone LIKE '$query%'";
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
                    "cin" => $row["cin"],
                    "email" => $row["email"],
                    "phone" => $row["phone"],
                    "skills" => $row["skills"]
                );
            }
            echo json_encode(["status" => 1, "data" => $employees]);
        }
    }
}
