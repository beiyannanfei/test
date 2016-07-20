function $(id){
	return document.getElementById(id);
}

function initial(){
	btnMp4 = $("btnMp4");
	btnOgg = $("btnOgg");
	btnWebM = $("btnWebM");

	btnMp4.addEventListener("click",btnMp4_click,false);
}
/**
 * 通过video元素 验证是否支持mp4
 */
function btnMp4_click(e){
	var video = document.createElement("video");
	var ret = video.canPlayType("video/mp4");
	if(ret == "-"){
		window.alert("该类型视频可能无法播放，慎重啊。。。");
	}else {
		window.alert("哦了!");
	}
}

window.addEventListener("load",initial,false);