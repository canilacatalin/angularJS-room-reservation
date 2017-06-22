<?php

include $_SERVER['DOCUMENT_ROOT'] . '/angularReservation/dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
$id = mysqli_real_escape_string($db_connect, $data->id);
$floor = mysqli_real_escape_string($db_connect, $data->floor);
$capacity = mysqli_real_escape_string($db_connect, $data->capacity);
$name = mysqli_real_escape_string($db_connect, $data->name);
	
$upd = "UPDATE rooms set name='" . $name . "', floor='" . $floor . "',  capacity='" . $capacity . "' WHERE id='" . $id . "'";
			mysqli_query($db_connect,$upd);
			
mysqli_close($db_connect);


?>