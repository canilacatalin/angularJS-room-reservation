<?php

include("dbconnect.php");
$data = json_decode(file_get_contents("php://input"));
$password = mysqli_real_escape_string($db_connect, $data->password);
$username = mysqli_real_escape_string($db_connect, $data->username);

$select_user = "SELECT * FROM admins WHERE username = '$username' AND password = '$password'";
$result = $db_connect->query($select_user);
while($row = $result->fetch_assoc()){
	if($row['username'] == $username && $row['password'] == $password){
		echo "success";
	}
	else
	{
		echo "failure";
	}
}
?>