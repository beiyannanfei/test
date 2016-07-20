<?php
	$msg = 'Hello World';

	//读取所有的请求头
	$headers = getallheaders();
	//读取其中的Accept-Language——客户端首选语言
	$lang = $headers['Accept-Language'];
	if( strncmp('zh', $lang, 2) === 0 ){
		$msg = '世界你好';
	}elseif(strncmp('ja', $lang, 2) === 0){
		$msg = 'ﾗｸﾁﾝﾗﾘﾘﾘ';
	}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
  <title></title>
  <style type="text/css">
	*{margin:0; padding:0;}
  </style>
 </head>

 <body>
	<h2>一个见人说人话的网页：</h2>
    <?php echo $msg; ?>
 </body>
</html>
