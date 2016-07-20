//根据ID获取指定的元素
/*function $(id){
	return document.getElementById(id);
}*/

/**
 * 语法:$("#id")
 * 参数:selector:选择器，可以是id选择器(#id),类选择器(.className),标签选择器(div)
 */
/*function $(selector){
	var c = selector.substring(0,1);
	if(c == '#'){
		return document.getElementById(selector.substring(1,selector.length));
	}
}*/
/**
 * 类选择器
 * 语法:$(".class")
 */
/*function $(selector){
	//判断浏览器是否支持getElementsByClassName
	var className = selector.substring(1);
	if(document.getElementsByClassName){
		return document.getElementsByClassName(className)
		//document.querySelectorAll('.cls');
	}else{
		//document.getElementsByTagName('*') + 正则表达式
		var reg = new RegExp("(^|\\s)"+className+"($|\\s)");
		var elems = document.getElementsByTagName("*");
		var arr=[]; //保存获取到的指定className的元素
		for(var i=0;i<elems.length;i++){
			if(reg.test(elems[i].className)){
				arr.push(elems[i]);
			}
		}
		return arr;
	}
	
}*/

/**
 * 标签选择器
 * 语法:$("element")
 */

function $(element){
	return document.getElementsByTagName(element);
}