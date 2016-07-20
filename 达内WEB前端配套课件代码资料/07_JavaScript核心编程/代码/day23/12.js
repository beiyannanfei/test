function healthIndex(weight, height){
	var index = weight / (height * height);
	if(index>25){
		return '偏胖';
	}else if(index>20){
		return '适中';
	}else {
		return '偏瘦';
	}
}

var r = healthIndex(70, 1.8);
console.log(r);