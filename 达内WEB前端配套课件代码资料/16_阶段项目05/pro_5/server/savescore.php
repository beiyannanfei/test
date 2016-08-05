<?php 
	$uid=$_REQUEST["uid"];
	$score=$_REQUEST["score"];

	$link = mysqli_connect("localhost","root","","shooter");
	$query_str = "insert into score values(default,'$uid','$score')";
	$result = mysqli_query($link,$query_str);
	$result_count = mysqli_affected_rows($link);
	if($result_count > 0)
		echo "OK";
	else
		echo "ERROR";
?>