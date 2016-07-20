<?php 
	header("content-type:text/xml");
	$xmlTxt = $_REQUEST["xml"];
	//对$xmlTxt进行处理，将其转换成 XMLDocument
	echo $xmlTxt;
?>

