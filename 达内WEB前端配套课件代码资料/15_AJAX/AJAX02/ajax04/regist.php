<?php 
	$loginname=$_REQUEST["loginname"];
	$loginpwd=$_REQUEST["loginpwd"];
	$nickname=$_REQUEST["nickname"];

	$sql="insert into users values(default,'$loginname','$loginpwd','$nickname')";

	$link = mysqli_connect("localhost","root","","test");
	if(mysqli_query($link,$sql)){
		$result_count = mysqli_affected_rows($link);
		if($result_count > 0){
			echo "OK";
		}else{
			echo "ERROR";
		}
	}else{
		//语法执行错误
		echo "服务器出现问题，请联系管理员... ... ";
	}
	

?>