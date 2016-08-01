function $(id){
	return document.getElementById(id);
}

function initial(){
	playBtn=$("playBtn");
	checkBtn=$("checkBtn");
	media = $("media");
	
	playBtn.addEventListener("click",playBtn_click,false);
	checkBtn.addEventListener("click",checkBtn_click,false);
}

function playBtn_click(e){
	if(media.paused){
		media.play();
		e.target.value = "暂停";
	} else {
		media.pause();
		e.target.value = "播放";
	}
}

function checkBtn_click(e){
	var audio = document.createElement("audio");

	console.log(audio.canPlayType("audio/wma"));
}



window.addEventListener("load",initial,false);