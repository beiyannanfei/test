function $(id){
	return document.getElementById(id);
}


function initial(){
	
	//获取canvas以及绘图上下文
	var canvas=$("canvas");
	ctx = canvas.getContext("2d");

	btnRect = $("btnRect");
	btnScale = $("btnScale");
	btnSaveStatus=$("saveStatus");
	btnRestoreStatus=$("restoreStatus");
	btnTran=$("btnTran");

	btnRect.addEventListener("click",btnRect_click,false);
	btnScale.addEventListener("click",btnScale_click,false);
	btnSaveStatus.addEventListener("click",btnSaveStatus_click,false);
	btnRestoreStatus.addEventListener("click",btnRestoreStatus_click,false);
	btnTran.addEventListener("click",btnTran_click,false);
}

/**
 * 更换画布远点,由默认的(0,0)更改为(100,100)
 */
function btnTran_click(){
	ctx.translate(100,100);
	alert("原点更换成功!");
}

/**
  * 保存画布当前状态，比如缩放等。。。
  * save()
  */
function btnSaveStatus_click(){
	ctx.save();
}

/**
 * 恢复画布状态到最近一次的save时候
 */
function btnRestoreStatus_click(){
	ctx.restore();
}

/**
 * 随机位置绘制大小为 100*100的矩形
 */
function btnRect_click(){
	var x = parseInt(Math.random() * 500);
	var y = parseInt(Math.random() * 400);

	/*var x=0;
	var y=0;*/

	//设置填充颜色
	ctx.fillStyle="rgba(99,155,201,1)";
	ctx.strokeStyle="rgba(99,155,201,1)";

	//ctx 为 canvas绘图上下文
	ctx.strokeRect(x,y,100,100);
	ctx.fillRect(x,y,100,100);
}
/**
 * 将ctx的缩放增大至2倍
 * ctx.scale(2,2);
 */
function btnScale_click(){
	ctx.scale(2,2);	
}

window.addEventListener("load",initial,false);