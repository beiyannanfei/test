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
	$("#txtName").blur(function () {
		var xhr = createXhr();
		var name = $("#txtName").val();
		var url = "/ajax/a3";
		xhr.open("post", url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				$("#txtNameTip").html(xhr.responseText);
			}
		};
		xhr.send("name=" + name);
	});
});
