<?php
include 'db.php';
$query = isset($_GET['query']) ? mysqli_real_escape_string($conn, $_GET['query']) : '';
$sql = 'SELECT * FROM employees';
if (!empty($query)) {
    $sql .= " WHERE name LIKE '$query%' OR position LIKE '$query%' OR email LIKE '$query%' OR phone LIKE '$query%'";
}
$res = mysqli_query($conn, $sql);
if (mysqli_num_rows($res) == 0) {
    echo "No employees found.";
    exit;
}
$filename = "employees_" . "Pega_Health" . "_" . date('Y-m-d') . ".csv";
header('Content-Type: text/csv');
header('Content-Disposition: attachment;filename=' . $filename);
$output = fopen('php://output', 'w');
fputcsv($output, array('ID', 'Name', 'Position', 'Email', 'Phone'));
while ($row = mysqli_fetch_assoc($res)) {
    fputcsv($output, array(
        $row['id'],
        $row['name'],
        $row['position'],
        $row['email'],
        '"' . $row["phone"] . '"',
    ));
}
fclose($output);
mysqli_close($conn);
