//添加对象方法 jQuery.fn.method = function()
jQuery.fn.changeBgColor = function(){
	//this 表示当前的jQuery对象
	this.css("background-color","red");
}

//添加对象方法 swapClass
jQuery.fn.swapClass = function(c1,c2){
	//this 表示当前的jQuery对象
	return this.each(function(){
		//this 表示当前的DOM元素
		var $elem = $(this);
		if($elem.hasClass(c1)){
			$elem.removeClass(c1).addClass(c2);
		} else {
			$elem.removeClass(c2).addClass(c1);
		}
	});
	//return $obj;
}