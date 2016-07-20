function $(id){
	return document.getElementById(id);
}

function initial(){
	//为img绑定事件:
	//1、开始拖拽时:dragstart
	//2、拖拽过程中:drag
	//3、结束拖拽:dragend

	//为tarDiv绑定事件(目标元素)
	//1、第一次进入到目标元素:dragenter
	//2、在目标元素内移动:dragover
	//3、投放:drop
	//4、源元素移出目标元素:dragleave

	var img = $("img");
	var tarDiv=$("tarDiv");
	//绑定事件
	img.addEventListener("dragstart",img_dragstart,false);
	img.addEventListener("drag",img_drag,false);
	img.addEventListener("dragend",img_dragend,false);

	tarDiv.addEventListener("dragenter",tarDiv_dragenter,false);
	tarDiv.addEventListener("dragover",tarDiv_dragover,false);
	tarDiv.addEventListener("drop",tarDiv_drop,false);
	tarDiv.addEventListener("dragleave",tarDiv_dragleave,false);
}

function tarDiv_dragleave(e){
	$("d_leave").innerHTML="源元素已离开目标区域...";
	e.preventDefault();
}

function tarDiv_drop(e){
	$("d_drop").innerHTML="已经投放...";
	//创建指定图像
	/*var img = new Image();
	img.src="img/flower.png"
	e.target.appendChild(img);*/
	var src=e.dataTransfer.getData("text");
	var img = new Image();
	img.src=src;
	e.target.appendChild(img);
	//清空dataTransfer中的数据
	e.dataTransfer.clearData("text");
	e.preventDefault();
}

function tarDiv_dragover(e){
	var x=e.offsetX;
	var y=e.offsetY;
	$("d_over").innerHTML=x + ":" + y;
	e.preventDefault();
}

function tarDiv_dragenter(e){
	$("d_enter").innerHTML="已经进入到目标区域";
	e.preventDefault();
}

function img_dragstart(e){
	//阻止默认操作
	//e.preventDefault();

	$("d_start").innerHTML = "开始拖拽...";
	$("d_end").innerHTML = "";

	//获取图像路径
	var imgSrc = e.target.src;
	//将地址保存进dataTransfer对象
	e.dataTransfer.setData("text",imgSrc);

	//设置鼠标图像
	e.dataTransfer.setDragImage(e.target,0,0);
}

function img_drag(e){
	var x = e.pageX;
	var y = e.pageY;

	$("d_drag").innerHTML=x +":" + y;
}

function img_dragend(){
	$("d_end").innerHTML="源元素拖放结束";
	$("d_start").innerHTML = "已经结束了";
}

window.addEventListener("load",initial,false);