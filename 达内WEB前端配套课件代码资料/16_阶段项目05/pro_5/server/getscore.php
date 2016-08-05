 <?php 
	$link = mysqli_connect("localhost","root","","shooter");
	$query_str = "select nickname,score from users inner join score on users.id=score.uid order by score desc limit 0,10";
	$result = mysqli_query($link,$query_str);
	$users_array = [];
	while($row=mysqli_fetch_row($result)){
		//将 nickname、score封装到 user 数组中
		$user = array("nickname"=>$row[0],"score"=>$row[1]);
		//将user数组添加到users_array数组中
		array_push($users_array,$user);
	}
	echo json_encode($users_array);

	//[{"nickname":"lwh","score","15"},{"nickname":"lwh","score","15"},{"nickname":"lwh","score","15"}...]


 ?>