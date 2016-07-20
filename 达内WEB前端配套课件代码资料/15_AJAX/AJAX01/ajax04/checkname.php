<?php 
	//1、连接数据库
	$host="localhost";
	$uname="root";
	$upwd="";
	$db="test";
	$link=mysqli_connect($host,$uname,$upwd,$db);
	//2、查询数据表
		//2.1 获取用户请求提交数据
		$loginName=$_REQUEST["loginName"];
		//2.2 拼sql语句
		$sql="select * from users where loginname='$loginName'";
		//2.3 查询
		$result=mysqli_query($link,$sql);
	//3、获取查询记录数
	$result_count = mysqli_num_rows($result);
	//4、根据查询结果响应数据给客户端
	if($result_count > 0)
		echo "用户名称已经存在";
	else
		echo "恭喜您，可以注册";
?>