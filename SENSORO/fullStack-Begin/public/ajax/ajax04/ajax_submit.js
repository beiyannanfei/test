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
		// alert("txtLoginName 失去焦点" + $(this).val());
		var xhr = createXhr();
		xhr.open("post", "/ajax/a4", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				$("#txtLoginNameTip").html(xhr.responseText);
			}
		};
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send("loginName=" + $(this).val());
	});
});