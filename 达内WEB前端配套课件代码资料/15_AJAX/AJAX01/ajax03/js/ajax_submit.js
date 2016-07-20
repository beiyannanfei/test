function createXhr(){
	//判断浏览器
	if(window.XMLHttpRequest){
		return new XMLHttpRequest();
	}else{
		return new ActiveXObject("Microsoft.XMLHttp");
	}
}

$(document).ready(function(){
	$("#txtName").blur(function(){
		//1、获取xhr
		var xhr = createXhr();
		//2、创建请求
		var name = $("#txtName").val();
		var url = "checkname.php";
		xhr.open("post",url,true);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		//3、设置回调函数
		xhr.onreadystatechange=function(){
			if(xhr.readyState == 4 && xhr.status == 200){
				var resText = xhr.responseText;
				$("#txtNameTip").html(resText);
			}
		}
		//4、发送请求
		xhr.send("name="+name);
	});
});