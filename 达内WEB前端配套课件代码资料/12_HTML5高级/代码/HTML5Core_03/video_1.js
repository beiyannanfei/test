function $(id){
	return document.getElementById(id);
}

function initial(){
	//1、获取video元素
	video = $("media");
	btnPlay=$("btnPlay");
	btnPause=$("btnPause");
	vdoDuration=$("vdoDuration");

	//2、加载事件
	//2.1 canplaythrough
	video.addEventListener("canplaythrough",video_canplaythrough,false);
	//2.2 ended : 更换一个视频文件
	video.addEventListener("ended",video_ended,false);
	//2.3 pause : 显示一幅图像(广告)
	video.addEventListener("pause",video_pause,false);
	//2.4 play : 将图像隐藏
	video.addEventListener("play",video_play,false);
	//2.5 通过按钮进行播放
	btnPlay.addEventListener("click",btnPlay_click,false);

	//3、初始化操作中的其他操作
	var totalDuration = video.duration;
	vdoDuration.innerHTML=parseInt(totalDuration)+"秒";
}

/**
 * 播放 或 暂停 
 */
function btnPlay_click(e){
	//video.play();
	//判断状态
	if(video.paused || video.ended){
		//暂停中....
		//1、视频播放
		//2、文本更改为暂停

		video.play();
		e.target.value="暂停";
	} else {
		//视频播放中
		//1、视频暂停
		//2、文本更改为播放

		video.pause();
		e.target.value="播放";
	}
}

/**
 * 视频开始播放时，所激发的事件 (暂停->播放、停止->播放)
 */
function video_play(e){
	$("advImg").style.display="none";
}

/**
 * 视频暂停时所激发的事件
 */
function video_pause(e){
	$("advImg").style.display="block";
}

function video_canplaythrough(e){
	console.log("视频已经全部下载完毕，请尽情观赏...");
}

function video_ended(e){
	video.style.display = "none";
	$("advImg").style.display="none";
}


window.addEventListener("load",initial,false);