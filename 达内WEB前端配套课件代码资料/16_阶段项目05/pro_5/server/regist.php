<?php 
	$loginName=$_REQUEST["loginName"];
	$loginPwd=$_REQUEST["loginPwd"];
	$nickName=$_REQUEST["nickName"];

	$link = mysqli_connect("localhost","root","","shooter");
	$query_str = "insert into users values(default,'$loginName','$loginPwd','$nickName')";
	$result = mysqli_query($link,$query_str);

	$result_count = mysqli_affected_rows($link);
	if($result_count > 0){
		//执行成功
		$uid = mysqli_insert_id($link);

		$json_array = array("uid"=>$uid,"nickname"=>$nickName); 
		echo json_encode($json_array);
	}else{
		//执行失败
		echo "ERROR";
	}

?>