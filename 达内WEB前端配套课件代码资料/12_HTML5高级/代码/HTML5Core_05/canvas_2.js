function $(id){
	return document.getElementById(id);
}

function initial(){
	var canvas = $("canvas");
	var ctx = canvas.getContext("2d");

	//设置文本
	//属性: 
	//  font : 与css相似
	//  textAlign:水平对齐方式,left,center,right
	//  textBaseLine:垂直对齐方式,top,middel,bottom
	//方法:
	//strokeText(text,x,y) : 在指定位置处绘制文本的轮廓
	//fillText(text,x,y) : 在指定位置处绘制填充的文字
	//measureText(text) : 通过该返回值的width属性，能够获取当前文本的宽度
	/*ctx.beginPath();
	ctx.font = "bold 24px 微软雅黑";
	ctx.strokeText("你好,世界!",20,20);
	ctx.fillText("你好,世界!",25,25);
	ctx.closePath();*/

	//设置阴影
	//属性:
	//shadowColor:采用css语法设置阴影颜色
	//shadowOffsetX:水平投射距离
	//shadowOffsetY:垂直投射距离
	//shadowBlur:模糊效果

	ctx.beginPath();
	ctx.shadowColor="#FF0000";
	ctx.shadowOffsetX=5;
	ctx.shadowOffsetY=5;
	ctx.shadowBlur=5;
	ctx.font = "bold 24px 微软雅黑";
	ctx.fillText("微软雅黑!",35,50);
	ctx.closePath();
}

window.addEventListener("load",initial,false);