//创建带有命名空间的函数(创建属于某一对象的函数)
jQuery.array_option = {
	myFunction : function(){
		console.log("array_option中的函数");
		console.log("Hello World");
	},
	myFunction1 : function(msg){
		console.log("array_option中的函数");
		console.log(msg);
	},
	sum:function(array){
		var sum = 0;
		/*$.each(array,function(i,value){
			sum += value;
		});*/

		/*$.each(array,function(i){
			sum += array[i];
		});*/

		/*$.each(array,function(i){
			sum += this;
		});*/

		$(array).each(function(i){
			sum += $(array).get(i);
		});
		return sum;
	}
}