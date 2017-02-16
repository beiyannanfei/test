/**
 * Created by wyq on 16/9/13.
 */
function createXhr() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	}
	else {
		return new ActiveXObject("Microsoft.XMLHttp")
	}
}

$(document).ready(function () {
	$('#txtName').blur(function () {
		alert("文本框失去焦点");
		var xhr = createXhr();
		var name = $("#txtName").val();
		var url = "/ajax/a2?name=" + name;
		xhr.open('get', url, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				$("#txtNameTip").html(xhr.responseText)
			}
		};
		xhr.send(null);
	});
});
