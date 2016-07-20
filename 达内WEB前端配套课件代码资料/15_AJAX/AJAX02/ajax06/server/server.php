<?php 
	$name=$_REQUEST["name"];
	//$resText="<h1>Hello $name</h1>";
	//$resText=json_encode("{name:'$name',age:'19',gender:'男'}");
	$array=array( "a"  =>  "orange" ,  "b"  =>  "banana" ,  "c"  =>  "apple");
	$resText=json_encode($array);
	echo $resText;
?>