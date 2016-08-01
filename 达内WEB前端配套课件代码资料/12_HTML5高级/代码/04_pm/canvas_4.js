function $(id){
	return document.getElementById(id);
}

function initial(){
	var canvas = $("canvas");
	ctx = canvas.getContext("2d");
	//创建渐变对象
	var grad = ctx.createLinearGradient(0,0,400,400);
	grad.addColorStop(0.5,"red");
	grad.addColorStop(0.8,"yellow");
	grad.addColorStop(0.9,"blue");

	ctx.fillStyle=grad;
	ctx.fillRect(0,0,400,400);
}

window.addEventListener("load",initial,false);