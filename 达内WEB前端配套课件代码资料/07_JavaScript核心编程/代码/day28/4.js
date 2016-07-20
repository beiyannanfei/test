


//变量名/引用名		
var emp1 = null;

console.log(emp1);	//null
//console.log(emp2);	//undefined


/*
var emp3 = null;
emp3.name = 'Tom';
console.log(emp3.name);
*/

emp1 = new Object();
emp1.ename = 'Tom';	//为对象新添一个属性
emp1.ename = 'Tommy';//修改已有属性的值
emp1.salary = 3500; //新添一个新的属性
emp1['salary'] = 4500; //修改已有属性的值

console.log(  emp1.ename  );
console.log(  emp1['ename']  );
console.log(  emp1.salary  );
console.log(  emp1['salary']  );

emp1.work = function(){	//为对象新添一个方法
	console.log(this.ename+'在工作');
}
emp1.work();	//调用对象的方法

emp1.getSalary = gs;  //gs();

function gs(){
	console.log(this.ename+"在领工资");
	return 5000;
}

emp1.getSalary();