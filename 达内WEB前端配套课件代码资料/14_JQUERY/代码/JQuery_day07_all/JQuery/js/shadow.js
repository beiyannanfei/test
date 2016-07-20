jQuery.fn.shadow = function(){
	//this 表示JQUERY对象
	this.each(function(){
		$obj = $(this); //将遍历出来的DOM元素转换成JQUERY对象
		for(var i=0;i<5;i++){
			$obj.clone().css({
				position:"absolute",
				left:$obj.offset().left + i,
				top:$obj.offset().top + i,
				opacity:0.3,
				zIndex:-1,
				margin:0
			}).appendTo("body");
		}
	});
}


/**
 * 使用简单参数实现阴影效果
 * slices : 阴影重复数量
 * opactiry : 透明度,0 - 1 之间
 * zIndex : 层叠次序
 */
jQuery.fn.shadow_simple = function(slices,opacity,zIndex){
	//this 表示JQUERY对象
	this.each(function(){
		$obj = $(this); //将遍历出来的DOM元素转换成JQUERY对象
		for(var i=0;i<slices;i++){
			$obj.clone().css({
				position:"absolute",
				left:$obj.offset().left + i,
				top:$obj.offset().top + i,
				opacity:opacity,
				zIndex:zIndex,
				margin:0
			}).appendTo("body");
		}
	});
}

/**
 * 使用参数映射完成参数设置
 * option : 参数对象，封装所有的参数信息
 *	slices : 阴影重复数量
 *	opactiry : 透明度,0 - 1 之间
 *	zIndex : 层叠次序
 */
jQuery.fn.shadow_map = function(option){
	//this 表示JQUERY对象
	this.each(function(){
		$obj = $(this); //将遍历出来的DOM元素转换成JQUERY对象
		for(var i=0;i<option.slices;i++){
			$obj.clone().css({
				position:"absolute",
				left:$obj.offset().left + i,
				top:$obj.offset().top + i,
				opacity:option.opacity,
				zIndex:option.zIndex,
				margin:0
			}).appendTo("body");
		}
	});
}

/**
 * 参数默认值
 */
jQuery.fn.shadow_default = function(option){
	
	var defaults = {
		slices:10,
		opacity:0.5,
		zIndex:-1
	};

	//将defaults与option进行合并
	var opts = $.extend(defaults,option);

	//this 表示JQUERY对象
	this.each(function(){
		$obj = $(this); //将遍历出来的DOM元素转换成JQUERY对象
		for(var i=0;i<opts.slices;i++){
			$obj.clone().css({
				position:"absolute",
				left:$obj.offset().left + i,
				top:$obj.offset().top + i,
				opacity:opts.opacity,
				zIndex:opts.zIndex,
				margin:0
			}).appendTo("body");
		}
	});
}

jQuery.fn.shadow_callback = function(option){
	
	var defaults = {
		slices:10,
		opacity:0.5,
		zIndex:-1,
		offset:function(i){
			var obj = {x:i,y:i};
			return obj;
		}
	};

	//将defaults与option进行合并
	var opts = $.extend(defaults,option);

	//this 表示JQUERY对象
	this.each(function(){
		$obj = $(this); //将遍历出来的DOM元素转换成JQUERY对象
		for(var i=0;i<opts.slices;i++){
			//获取回调函数对象
			var offset = opts.offset(i);
			$obj.clone().css({
				position:"absolute",
				left:$obj.offset().left + offset.x,
				top:$obj.offset().top + offset.y,
				opacity:opts.opacity,
				zIndex:opts.zIndex,
				margin:0
			}).appendTo("body");
		}
	});
}

//定义参数(全局)
jQuery.fn.shadow.defaults = {
	slices:10,
	opacity:0.5,
	zIndex:-1,
	offset:function(i){
		var obj = {x:i,y:i};
		return obj;
	}
}
/**
 * 可定制的默认值
 */
jQuery.fn.shadow_dingzhi = function(option){

	//将defaults与option进行合并
	var opts = $.extend({},jQuery.fn.shadow.defaults,option);

	//this 表示JQUERY对象
	this.each(function(){
		$obj = $(this); //将遍历出来的DOM元素转换成JQUERY对象
		for(var i=0;i<opts.slices;i++){
			//获取回调函数对象
			var offset = opts.offset(i);
			$obj.clone().css({
				position:"absolute",
				left:$obj.offset().left + offset.x,
				top:$obj.offset().top + offset.y,
				opacity:opts.opacity,
				zIndex:opts.zIndex,
				margin:0
			}).appendTo("body");
		}
	});
}