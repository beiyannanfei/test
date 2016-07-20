function $(id){
	return document.getElementById(id);
}

function initial(){
	var canvas = $("canvas");
	var ctx = canvas.getContext("2d");

	//绘制一幅图像到canvas上,需要Image
	var img = new Image();
	img.src="img/bike.jpg";
	//等待图像加载完毕时，绘制图像到canvas上
	img.onload = function(){
		//drawImage(img,x,y) 绘制图像
		//ctx.drawImage(img,150,120);
		//填充矩形框，内容为图像平铺
		//1、创建平铺对象ctx.createPattern(image,repeat);
		var pattern = ctx.createPattern(img,"repeat");
		//2、将返回值设置给fillStyle属性
		ctx.fillStyle=pattern;
		//3、填充矩形
		ctx.fillRect(0,0,400,300);
	}

	//切割图像
	ctx.beginPath();
	ctx.arc(150,150,50,0,Math.PI * 2 , true);
	ctx.closePath();
	ctx.clip();
	
}

window.addEventListener("load",initial,false);