<?php 
	$province = $_REQUEST["province"];
	$array=[];
	if($province == "北京市"){
		$array=array("朝阳区","海淀区","东城区");
	}else if($province == "上海市"){
		$array=array("浦东区","浦西区","浦南区","浦北区");
	}else if($province == "天津市"){
		$array=array("河东区","河西区","塘沽区");
	}
	$jsonCity = json_encode($array);
	echo $jsonCity;
?>