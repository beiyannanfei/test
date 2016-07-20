/**
值类型与引用类型最大的区别
**/

var n1 = 10;
var n2 = n1;
n2++;
console.log( n1 );
console.log( n2 );
console.log();

var emp1 = new Object();
emp1.age = 10;
var emp2 = emp1;	//给emp1取了别名
emp2.age++;
console.log( emp1.age );
console.log( emp2.age );

var emp3 = new Object();  //创建一个新的对象
emp3.age = 100;
console.log( emp3.age );
emp3.age++;
