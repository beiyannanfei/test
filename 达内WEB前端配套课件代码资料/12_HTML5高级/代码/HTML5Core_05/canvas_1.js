function $(id){
	return document.getElementById(id);
}

function initial(){
	var canvas = $("canvas");
	var ctx = canvas.getContext("2d");

	//设定线条粗细: lineWidth:1
	//设定线条线冒: lineCap:butt,round,square
	//设定两条线焦点: lineJoin : round , bevel,miter(默认)
	//miterLimit:当lineJoin为miter时，设置两点相交形成的锐角长度，默认为10

	ctx.lineWidth=10;
	ctx.lineCap="round";
	ctx.lineJoin="miter";
	ctx.miterLimit=3;
	
	//  移动笔触
	ctx.beginPath();
	
	ctx.moveTo(50,50);
	ctx.lineTo(100,100);
	ctx.lineTo(80,50);

	//设置线条颜色
	ctx.strokeStyle="#FF0000";
	//绘制线条
	ctx.stroke();
	ctx.closePath();
}

window.addEventListener("load",initial,false);