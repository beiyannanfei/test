<?php 
	$stockArray = [];
	for($i=0;$i<10;$i++){
		$rand = rand(10,99);
		$code = "600".$rand;
		$name = "中国银行".$rand;
		$price = rand(10,1000);
		$stock = array("code"=>$code,"name"=>$name,"price"=>$price);
		array_push($stockArray,$stock);
	}
	echo json_encode($stockArray);
?>
