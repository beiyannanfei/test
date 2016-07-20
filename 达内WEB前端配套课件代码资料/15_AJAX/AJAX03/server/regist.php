<?php 
	$hobbys=$_REQUEST["chkHobby"];
	$name=$_REQUEST["txtName"];
	$msg="$name"."_";
	for($i=0;$i<count($hobbys);$i++){
		$msg.=$hobbys[$i]."_";
	}
	echo $msg;
?>