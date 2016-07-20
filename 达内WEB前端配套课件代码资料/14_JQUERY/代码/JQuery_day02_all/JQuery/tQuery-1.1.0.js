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
	} else if(selector.indexOf("<") == 0 && selector.lastIndexOf(">")==selector.length-1){
		//1、判断是否为HTML标签
		//2、提取标签名称
		var elemName = selector.substring(1,selector.indexOf(">"));
		//3、document.createElement("div");
		var newElem = document.createElement(elemName);
		//4、封装标签内容
		var content = selector.substring(selector.indexOf(">")+1,selector.lastIndexOf("<"));
		newElem.innerHTML = content;
		//5、将元素封装到TQObject中
		this.tqObject.data.push(newElem);
	}
	else {
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
	},
	append:function(tqObject){
		//将tqObject里面的第一个元素增加到this里面的第一个元素里
		//$("body").append($('<div>Hello Tarena</div>'));
		var srcElem = this.data[0];
		var tarElem = tqObject.data[0];
		srcElem.appendChild(tarElem);
		return this;
	},
	appendTo:function(tqObject){
		//tqObject 为源元素
		//this 为目标元素
		//将this中的第一个元素，追加到tqObject的第一个元素中去
		var srcElem = tqObject.data[0];
		var tarElem = this.data[0];
		srcElem.appendChild(tarElem);
		return this;
	},
	insertBefore : function(tqObject){
		//newElm
		var newElm = this.data[0];
		//oldElm
		var oldElm = tqObject.data[0];
		//parentElm
		var parentElm = oldElm.parentNode;

		parentElm.insertBefore(newElm,oldElm);
		return this;
	},
	remove : function(){
		//被移除的元素 this.data[0]
		var removeElem = this.data[0];
		//获取被移除元素的父元素
		var parentElem = removeElem.parentNode;
		parentElem.removeChild(removeElem);
	},
	slideUp:function(speed){
		//1、获取元素高度
		var elem = this.data[0];
		var height = elem.offsetHeight;
		//判断是否有自定义的speed
		var s = speed || 300;
		var l = 30 / s * height;
		// l/height = 30 / s;
		

		
		//var h = elem.style.height; // 获取行内样式。内嵌、外部不行
		
		var oldHeight = height;
		var interval = setInterval(function(){
			//更新高度(递减)
			height -= l;
			elem.style.height = height+"px";
			//判断高度是否到达0
			if(height <= 0){
				
				//将原始高度赋值给当前的隐藏元素
				elem.style.display = "none";
				elem.style.height = oldHeight+"px";
				clearInterval(interval);
			}
		},30);
	},
	slideDown : function(speed){
		var elem = this.data[0];
		var height = parseInt(elem.style.height);
		
		var s = speed || 300;
		var l = 30 / s * height;

		elem.style.height = 0 + "px";
		elem.style.display = "block";
		console.log(elem.offsetHeight);
		var interval = setInterval(function(){
			elem.style.height = (elem.offsetHeight + l) + "px";
			if(elem.offsetHeight >= height){
				clearInterval(interval);
				elem.style.height = height + "px";
			}
		},30);
	},
	hide:function(speed){
		//1、获取元素高度、宽度
		var elem = this.data[0];
		var height = elem.offsetHeight;
		var width  = elem.offsetWidth;
		var s = speed || 300;

		var h = 30 / s * height;
		var w = 30 / s * width;

		var oldHeight = height;
		var oldWidth = width;

		var interval = setInterval(function(){
			height -= h;
			width -= w;
			elem.style.height = height + "px";
			elem.style.width = width + "px";
			if(height <= 0 || width <= 0){
				clearInterval(interval);
				elem.style.display = "none";
				elem.style.height = oldHeight + "px";
				elem.style.width = oldWidth + "px";
			}
		},30);
	},
	fadeOut : function(speed){
		var s = speed || 300;
		var elem = this.data[0];
		var op = 100;
		var l = 30 / s * op; 
		
		var interval = setInterval(function(){
			op -= l;
			elem.style.opacity = op / 100;
			if(op <= 0){
				elem.style.display = "none";
				clearInterval(interval);
			}
		},30);
	}

};