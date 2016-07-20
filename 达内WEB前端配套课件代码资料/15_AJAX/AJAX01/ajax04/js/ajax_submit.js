function createXhr(){
	//判断浏览器
	if(window.XMLHttpRequest){
		return new XMLHttpRequest();
	}else{
		return new ActiveXObject("Microsoft.XMLHttp");
	}
}

$(document).ready(function(){
	$("#txtLoginName").blur(function(){
		//1
		var xhr = createXhr();
		//2
		xhr.open("post","checkname.php",true);
		//3
		xhr.onreadystatechange = function(){
			if(xhr.readyState ==4 && xhr.status == 200){
				$("#txtLoginNameTip").html(xhr.responseText);
			}
		}
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		//4
		xhr.send("loginName="+$(this).val());
	});
});