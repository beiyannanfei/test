<?php
	/**
	*注意：由于此php文件向客户端输出的是二进制图片数据，
	*故开始标记之前和结束标记之后不能有任何字符输出（空白字符都不可以）；
	*且php执行部分也只能输出最终的图片内容，中间不能出现字符输出
	*/
	//设置响应输出头
	header('Expires: Sat, 01 Jan 1970, 08:00:00 GMT');	//缓存控制
	header('Cache-Control: no-cache');					//缓存控制
	header('Pragma: no-cache');							//缓存控制
	header('Content-Type: image/png');	//输出主体内容类型

	$w = 80;	//图片的宽
	$h = 24;	//图片的高
	$img = imagecreate($w, $h);	//在服务器端内存中创建一个图片

	//创建一个颜色变量
	$c = imagecolorallocate($img, 
		rand(150, 230), 
		rand(150,230), 
		rand(150,230));	//rand(min,max)返回指定范围内的随机整数
	//在图像上画一个矩形，当作背景颜色
	imagerectangle($img, 0, 0, $w, $h, $c);

	//添加四个随机字符
	$src = 'ABCDEFGHJKLMNPQRSTUVWXY3456789';	//随机字符的范围
	for($i=0; $i<4; $i++){
		$s = $src[ rand(0,strlen($src)) ];
		$c = imagecolorallocate($img, rand(50, 160), rand(50, 160), rand(50, 160));
		//imagettftext($image, $size, $angle, $x, $y, $color, $fontfile, $text)
		imagettftext($img, rand(12,18), rand(-45,45), 8+$i*15, 18, $c, 'Arial.ttf', $s);
	}

	//添加几条随机干扰线——不宜过多
	for($i=0; $i<5; $i++){
		$c = imagecolorallocate($img, rand(50, 160), rand(50, 160), rand(50, 160));
		//imageline($image, $x1, $y1 , $x2, $y2, $color )  画线
		imageline($img, rand(0,$w), rand(0,$h), rand(0,$w), rand(0,$h), $c);
	}

	//添加若干杂色点
	for($i=0; $i<50; $i++){
		$c = imagecolorallocate($img, rand(50, 160), rand(50, 160), rand(50, 160));
		//imageellipse($image, $cx, $cy , $width, $height, $color) 画椭圆
		imageellipse($img, rand(0,$w), rand(0,$h), 1, 1, $c);
	}

	imagepng($img);		//将图片输出到响应主体中
	imagedestroy($img);	//将服务器内存中的图片销毁
?>