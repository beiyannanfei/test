/*
创建一个正方形对象
*/

/*
var square1 = {
	width:10,
	perimeter:40,
	size:100
};
square1.width = 11;	//数据完整性出问题了！
*/


var square2 = {
	//width:10,			//数据属性
	__width:0;
	/*get width(){
		return this.__width;	
	}
	set width(value){
		this.__width = value;
	}*/
	get perimeter(){	//访问器属性
		console.log('Perimeter属性的get访问器被调用了....');
		return this.width*4;
	},
	set perimeter(value){
		console.log('Perimeter属性的set访问器被调用了....'+value);
		this.width = value/4;
	},
	get size(){
		return this.width*this.width;
	},
	set size(value){
		this.width = Math.sqrt(value);
	}

};

console.log( square2.width );
console.log( square2.perimeter );

square2.width = 20;
console.log( square2.width );
console.log( square2.perimeter );

console.log();
square2.perimeter = 200;
console.log( square2.width );
console.log( square2.perimeter );

console.log();
console.log( square2.size );
square2.size = 10000;
console.log( square2.width );
console.log( square2.size );