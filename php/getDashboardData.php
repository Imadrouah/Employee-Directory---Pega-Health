<?php
include('db.php');

$data = array();

$query = "SELECT COUNT(*) AS total_admins FROM users WHERE role = 'admin'";
$res = mysqli_query($conn, $query);
$row = mysqli_fetch_assoc($res);
$data['total_admins'] = $row['total_admins'];

$query = "SELECT COUNT(*) as total_employees FROM employees";
$res = mysqli_query($conn, $query);
$row = mysqli_fetch_assoc($res);
$data['total_employees'] = $row['total_employees'];

$query = "SELECT COUNT(*) as total_users FROM users";
$res = mysqli_query($conn, $query);
$row = mysqli_fetch_assoc($res);
$data['total_users'] = $row['total_users'];

$query = "SELECT COUNT(*) AS this_month_events 
            FROM notifications 
            WHERE MONTH(event_date) = MONTH(CURDATE()) 
            AND YEAR(event_date) = YEAR(CURDATE());";
$res = mysqli_query($conn, $query);
$row = mysqli_fetch_assoc($res);
$data['month_events'] = $row['this_month_events'];

$query = "SELECT position, COUNT(*) AS total FROM employees GROUP BY position";
$res = mysqli_query($conn, $query);
$pos = array();
if (mysqli_num_rows($res) > 0) {
    while ($row = mysqli_fetch_assoc($res))
        $pos[] = ["position" => $row['position'], "total" => $row["total"]];
} else
    $pos = 0;

$data['pos_data'] = $pos;
echo json_encode($data);
