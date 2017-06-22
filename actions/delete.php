<?php

include $_SERVER['DOCUMENT_ROOT'] . '/angularReservation/dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
$id = mysqli_real_escape_string($db_connect, $data->id);

$delete = "DELETE from rooms WHERE id='" . $id . "'";
			mysqli_query($db_connect,$delete);	


mysqli_close($db_connect);


?>