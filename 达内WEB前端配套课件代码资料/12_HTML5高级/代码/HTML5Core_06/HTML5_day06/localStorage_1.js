function $(id){
	return document.getElementById(id);
}

function initial(){
	//获取元素
	btnSave = $("btnSave");
	btnShow = $("btnShow");
	//绑定事件
	btnSave.addEventListener("click",btnSave_click,false);
	btnShow.addEventListener("click",btnShow_click,false);
}

/**
 * 1、根据txtKey的值，获取value
 * 2、获取所有的value，并且显示
 */
function btnShow_click(){
	//1、根据txtKey的值，获取value
	//findByKey();
	//2、
	findAll()
}

/**
 *  获取localStorage中所有的数据
 * length:获取长度
 * 循环遍历每一个key, key(index)
 * getItem(key)
 */
function findAll(){
	//清空tbody中的所有数据
	$("body").innerHTML="";

	//获取所有数据长度 
	var length = localStorage.length;
	for(var i = 0 ; i < length ; i ++){
		//根据i的值，获取对应的key
		var key = localStorage.key(i);
		var value = localStorage.getItem(key);

		var tr = document.createElement("tr");
		var td1 = document.createElement("td");
		var td2 = document.createElement("td");

		td1.innerHTML=key;
		td2.innerHTML=value;
		
		tr.appendChild(td1);
		tr.appendChild(td2);

		$("body").appendChild(tr);

	}
}

function findByKey(){
	var key = $("txtKey").value;
	var value = localStorage.getItem(key);
	alert(value);
}

/**
 * 获取 txtKey,txtValue的值，并且保存到localStorage中
 * localStorage.setItem(key,value);
 */
function btnSave_click(){
	var key = $("txtKey").value;
	var value = $("txtValue").value;
	//保存进localStorage
	localStorage.setItem(key,value);
	window.alert("保存成功!");
}
/**
 * 当得到storage通知后，更新table中显示的数据
 */
function window_storage(){
	findAll();
}

window.addEventListener("load",initial,false);
window.addEventListener("storage",window_storage,false);