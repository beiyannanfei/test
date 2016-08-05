<?php 
	$loginname=$_REQUEST["txtLoginName"];
	$loginpwd=$_REQUEST["txtLoginPwd"];

	$link = mysqli_connect("localhost","root","","shooter");
	$query_str = "select * from users where loginname='$loginname' and loginpwd='$loginpwd'";
	$result = mysqli_query($link,$query_str);
	if($result){
		$result_count = mysqli_num_rows($result);
		if($result_count > 0){
			//登录成功
			if($row = mysqli_fetch_row($result)){
				$uid=$row[0];
				$nickname=$row[3];
				$json_array = array("uid"=>$uid,"nickname"=>$nickname);
				echo json_encode($json_array);
			}
		}else{
			echo "ERROR";
		}
	}else{
		echo "SERVER_ERROR";
	}
?>