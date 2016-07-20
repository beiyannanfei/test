var stu = { chinese:90 };	//为对象添加属性
stu.math = 80;				//为对象添加属性

console.log(stu.chinese);
console.log(stu.math);


//为对象添加一个新的数据属性——ECMAScript5新添语法
Object.defineProperty(
	stu,
	'english',
	{/*属性描述符对象*/
		value:99,
		writable:true,
		enumerable:true,
		confirgurable:true
	}
);
console.log();
console.log(stu.english);
stu.english = 100;
console.log(stu.english);

//使用属性的特性定义一个新的访问器属性
Object.defineProperty(
	stu,
	'total',
	{/*属性的描述符对象——定义属性的特性*/
		get:function(){
			return this.chinese+this.math+this.english;
		},
		/*set:function(value){
			this.chinese = value/3;
			this.math = value/3;
			this.english = value/3;
		},*/
		enumerable:true,
		configurable:true
	}
);

console.log( );
console.log( stu.total);
stu.total = 300;
console.log( stu.total);




//遍历、枚举对象的每个属性
for(var p in stu){
	console.log(p+'=>'+stu[p]);
}
//遍历、枚举对象的每个属性
var arr = Object.keys(stu);
console.log('stu对象中属性的个数：'+arr.length);


/*重新配置属性的特性*/
/*Object.defineProperty(
	stu,
	'english',
	{
		value:99,
		writable:true
	}
);*/