//根据cookie中的数据设定页面的默认样式文件
function setStyle(){
	var style = getCookieValue('pageStyle');
	if(!style){ //Cookie中没有保存任何样式名称
		style = 'VerdeModerna'; //设置一个默认样式文件名
	}

	//查找link元素
	var link = document.getElementById('chosenStyle');
	//设置link元素的href属性，即整个页面的默认样式
	link.setAttribute('href', 'css/'+style+'.css');
}

//根据cookie名，查找出该cookie对应的值
function getCookieValue(cookieName){
	var arr = document.cookie.split('; '); //使用分号+空格拆分
	for(var i=0; i<arr.length; i++){
		var cookiePair = arr[i].split('=');
		if(cookiePair[0] == cookieName){
			return decodeURIComponent(cookiePair[1]);
		}
	}
}

//保存指定的样式文件名到Cookie，并在当前页面中也应用该样式
function saveStyle(styleName){
	var expires = new Date().getTime() + 1000*3600*24*30;
	document.cookie = 'pageStyle='+encodeURIComponent(styleName)+';expires='+new Date(expires).toGMTString();

	setStyle();
}