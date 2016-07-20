var emp1 = {
				"ename": "Tom",
				"age": 25
			};

console.log(emp1);
//默认情况下，所有的js对象都有一个toString()，
//从父对象继承过来的
console.log(emp1.toString()); 

//改写、重写、覆盖父对象提供的方法
emp1.toString = function(){
	return 'ENAME:'+this.ename+" AGE:"+this.age;
};
console.log(emp1.toString()); 