function $(id){
	return document.getElementById(id);
}

function initial(){
	var canvas = $("canvas");
	ctx = canvas.getContext("2d");
	//绘制路径beginPath() closePath() moveTo() lineTo() stroke() 
	//当前笔触位置为(0,0)
	ctx.beginPath();
	//移动笔触位置到(35,80)
	ctx.moveTo(35,80);
	//画一条直线(100,100)
	ctx.lineTo(100,100);
	ctx.lineTo(125,0);
	//闭合路径
	ctx.closePath();
	
	//设置背景颜色
	ctx.fillStyle="red";
	
	//绘制线条
	ctx.stroke();
	//填充形状
	ctx.fill();

	//绘制圆形
	ctx.beginPath();
	ctx.arc(100,100,50,0,Math.PI*2,false);
	ctx.closePath();
	ctx.fillStyle="red";
	ctx.fill();

	//绘制半圆
	ctx.beginPath();
	ctx.arc(250,250,50,Math.PI / 2,Math.PI *3 / 2,false);
	ctx.closePath();
	ctx.fill();

}

window.addEventListener("load",initial,false);