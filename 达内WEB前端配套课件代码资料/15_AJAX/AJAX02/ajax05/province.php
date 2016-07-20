<?php 
	//通过array创建数组
	$province = array("北京市","上海市","天津市");
	//通过json_encode将array转换成json
	$jsonProvince=json_encode($province);
	echo $jsonProvince;
?>