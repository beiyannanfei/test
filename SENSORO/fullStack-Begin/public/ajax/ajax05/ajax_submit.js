/**
 * Created by wyq on 16/9/13.
 */
function createXhr() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	}
	else {
		return new ActiveXObject("Microsoft.XMLHttp");
	}
}

$(document).ready(function () {
	$("#txtLoginName").blur(function () {
		var xhr = createXhr();
		xhr.open("post", "/ajax/a4", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if ($("#txtLoginNameTip").hasClass("redColor")) {
					$("#txtLoginNameTip").addClass("blueColor");
				}
				$("#txtLoginNameTip").html(xhr.responseText);
			}
		};
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send("loginName=" + $(this).val());
	});

	$("#btnRegist").click(function () {
		if ($("#txtLoginNameTip").html() == "用户名已经存在!") {
			$("#txtLoginNameTip").removeClass("blueColor");
			$("#txtLoginNameTip").addClass("redColor");
			return;
		}
		var loginName = $("#txtLoginName").val();
		var loginPwd = $("#txtLoginPwd").val();
		var nickName = $("#txtNickName").val();

		var xhr = createXhr();
		xhr.open("post", "/ajax/a5", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if (xhr.responseText == "OK") {
					return $("table").html("<tr><td><h1>欢迎:" + loginName + "</h1></td></tr>");
				}
				return window.alert("信息有误, 请核对后重新提交");
			}
		};
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send("loginname=" + loginName + "&loginpwd=" + loginPwd + "&nickname=" + nickName);
	});
});