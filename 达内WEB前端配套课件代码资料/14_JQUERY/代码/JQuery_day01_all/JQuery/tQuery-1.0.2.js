/**
 * 封装TQObject对象,提供一个数组元素，以及若干自定义的操作方法
 * 封装选择器
 * 通过封装$("#id|.class|element")来获取元素
 */

/**
 * 获取界面元素
 * selector:选择器,可以是类，id，标记
 */
var $ = function(selector){
	this.tqObject = new TQObject();
	if(selector.substring(0,1) == "#"){
		var elem = document.getElementById(selector.substring(1));
		this.tqObject.data.push(elem);
	} else if(selector.substring(0,1) == "."){
		//类选择器的操作
		var elems = document.getElementsByTagName("*");
		var reg = new RegExp("(^|\\s)"+selector.substring(1)+"($|\\s)");
		for(var i=0 ; i < elems.length ; i ++){
			if(reg.test(elems[i].className)){
				this.tqObject.data.push(elems[i]);	
			}
		}
	} else {
		//标记选择器
		var elems = document.getElementsByTagName(selector);
		this.tqObject.data=elems;
	}
	return tqObject;
}


/**
 * 封装TQObject
 */
var TQObject = function(){
	this.data = [];
}

TQObject.prototype = {
	size:function(){
		return this.data.length;
	},
	html:function(content){
		if(content){
			//为元素设置html值(xx.innerHTML="")
			for(var i=0;i<this.data.length;i++){
				this.data[i].innerHTML = content;
			}
			return this;//返回自己，从而实现方法的连缀调用
		}else{
			//获取html值(return xx.innerHTML)
			if(this.data.length != 0){
				return this.data[0].innerHTML;
			}
			return;
		}
	},
	val:function(value){
		if(value){
			//为value属性设置值
			for(var i=0;i<this.data.length;i++){
				this.data[i].setAttribute("value",value);
				//this.data[i].value = value;
			}
			return this;
		}else{
			//取值
			if(this.data.length != 0){
				return this.data[0].value;
				//return this.data[0].getAttribute("value");
			}

		}
	},
	attr:function(name,value){
		if(name && value){
			for(var i=0;i<this.data.length;i++){
				this.data[i].setAttribute(name,value);
			}
			return this;
		}else if(name){
			if(this.data.length != 0){
				return this.data[0].getAttribute(name);
			}
		}
	},
	addClass:function(className){
		for(var i=0;i<this.data.length;i++){
			var elem = this.data[i];
			if(elem.getAttribute("class")){
				//已经有class属性了
				var oldClassName = elem.getAttribute("class");
				var newClassName = oldClassName+" "+className;
				elem.setAttribute("class",newClassName);
			}else {
				//设置class属性
				elem.setAttribute("class",className);
			}
		}
	},
	removeClass:function(className){
		if(className){
			//删除指定名称的类样式
			//<input class="a a1 b c" />
			//a b c
			for(var i=0;i<this.data.length;i++){
				var arr=this.data[i].getAttribute("class").split(" ");
				var newClassName="";
				for(var j=0;j<arr.length;j++){
					if(arr[j] == className){
						continue;
					}
					newClassName += arr[j] + " ";
				}
				newClassName=newClassName.substring(0,newClassName.length-1);
				this.data[i].setAttribute("class",newClassName);
			}
			return this;
		}else{
			//移除所有类样式
			for(var i=0;i<this.data.length;i++){
				this.data[i].setAttribute("class","");
			}
			return this;
		}
	}

};