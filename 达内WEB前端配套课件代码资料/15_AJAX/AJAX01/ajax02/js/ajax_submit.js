function createXhr(){
	//判断浏览器
	if(window.XMLHttpRequest){
		return new XMLHttpRequest();
	}else{
		return new ActiveXObject("Microsoft.XMLHttp");
	}
}

$(document).ready(function(){
	// alert("初始化成功");
	$("#txtName").blur(function(){
		alert("文本框市区焦点");
		//1、获取xhr
		var xhr = createXhr();
		//2、创建请求
		var name = $("#txtName").val();
		var url = "checkname.php?name="+name;
		xhr.open("get",url,true);
		//3、设置回调函数
		xhr.onreadystatechange=function(){
			if(xhr.readyState == 4 && xhr.status == 200){
				var resText = xhr.responseText;
				$("#txtNameTip").html(resText);
			}
		}
		//4、发送请求
		xhr.send(null);
	});
});