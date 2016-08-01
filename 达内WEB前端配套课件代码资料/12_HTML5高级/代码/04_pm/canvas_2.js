function $(id){
	return document.getElementById(id);
}

/**
 * 初始化方法
 * 绘制三个矩形 实心、轮廓、擦出
 * fillRect
 * strokeRect
 * clearRect
 */
function initial(){
	//1、准备工作
	var canvas = $("canvas");
	ctx = canvas.getContext("2d");

	ctx.strokeRect(100,100,300,300);
	ctx.fillRect(120,120,260,260);
	ctx.clearRect(140,140,220,220);
}

window.addEventListener("load",initial,false);