<?php
	/**
	*ע�⣺���ڴ�php�ļ���ͻ���������Ƕ�����ͼƬ���ݣ�
	*�ʿ�ʼ���֮ǰ�ͽ������֮�������κ��ַ�������հ��ַ��������ԣ���
	*��phpִ�в���Ҳֻ��������յ�ͼƬ���ݣ��м䲻�ܳ����ַ����
	*/
	//������Ӧ���ͷ
	header('Expires: Sat, 01 Jan 1970, 08:00:00 GMT');	//�������
	header('Cache-Control: no-cache');					//�������
	header('Pragma: no-cache');							//�������
	header('Content-Type: image/png');	//���������������

	$w = 80;	//ͼƬ�Ŀ�
	$h = 24;	//ͼƬ�ĸ�
	$img = imagecreate($w, $h);	//�ڷ��������ڴ��д���һ��ͼƬ

	//����һ����ɫ����
	$c = imagecolorallocate($img, 
		rand(150, 230), 
		rand(150,230), 
		rand(150,230));	//rand(min,max)����ָ����Χ�ڵ��������
	//��ͼ���ϻ�һ�����Σ�����������ɫ
	imagerectangle($img, 0, 0, $w, $h, $c);

	//����ĸ�����ַ�
	$src = 'ABCDEFGHJKLMNPQRSTUVWXY3456789';	//����ַ��ķ�Χ
	for($i=0; $i<4; $i++){
		$s = $src[ rand(0,strlen($src)) ];
		$c = imagecolorallocate($img, rand(50, 160), rand(50, 160), rand(50, 160));
		//imagettftext($image, $size, $angle, $x, $y, $color, $fontfile, $text)
		imagettftext($img, rand(12,18), rand(-45,45), 8+$i*15, 18, $c, 'Arial.ttf', $s);
	}

	//��Ӽ�����������ߡ������˹���
	for($i=0; $i<5; $i++){
		$c = imagecolorallocate($img, rand(50, 160), rand(50, 160), rand(50, 160));
		//imageline($image, $x1, $y1 , $x2, $y2, $color )  ����
		imageline($img, rand(0,$w), rand(0,$h), rand(0,$w), rand(0,$h), $c);
	}

	//���������ɫ��
	for($i=0; $i<50; $i++){
		$c = imagecolorallocate($img, rand(50, 160), rand(50, 160), rand(50, 160));
		//imageellipse($image, $cx, $cy , $width, $height, $color) ����Բ
		imageellipse($img, rand(0,$w), rand(0,$h), 1, 1, $c);
	}

	imagepng($img);		//��ͼƬ�������Ӧ������
	imagedestroy($img);	//���������ڴ��е�ͼƬ����
?>