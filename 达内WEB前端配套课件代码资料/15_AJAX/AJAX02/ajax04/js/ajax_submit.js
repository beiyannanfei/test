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
				if($("#txtLoginNameTip").hasClass("redColor")){
					$("#txtLoginNameTip").removeClass("redColor");
				}	
				$("#txtLoginNameTip").html(xhr.responseText);
			}
		}
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		//4
		xhr.send("loginName="+$(this).val());
	});

	$("#btnRegist").click(function(){
		if($("#txtLoginNameTip").html() == "用户名称已经存在"){
			$("#txtLoginNameTip").addClass("redColor");
		}else{
			//获取数据
			var loginName = $("#txtLoginName").val();
			var loginPwd = $("#txtLoginPwd").val();
			var nickName = $("#txtNickName").val();

			//1
			var xhr = createXhr();
			//2
			xhr.open("post","regist.php",true);
			//3
			xhr.onreadystatechange = function(){
				if(xhr.readyState ==4 && xhr.status == 200){
					//根据提示信息做操作
					if(xhr.responseText == "OK"){
						//提示欢迎
						$("table").html("<tr><td><h1>欢迎:"+loginName+"</h1></td></tr>");
					} else{
						//提示失败
						window.alert("信息有误，请核对后重新提交");
					}
				}
			}
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			//4
			xhr.send("loginname="+loginName+"&loginpwd="+loginPwd+"&nickname="+nickName);
		}
	});
});