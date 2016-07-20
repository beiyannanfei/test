/*
常见的对象的原型——父对象
*/

var obj1 = new Object();
//console.log( obj1.__proto__ );
console.log( Object.getPrototypeOf(obj1) );
//console.log( obj1.__proto__ === Object.getPrototypeOf(obj1) );


var obj2 = {age:30};
console.log(Object.getPrototypeOf(obj2));

//console.log(Object.getPrototypeOf(obj2) === Object.getPrototypeOf(obj1));

//Object.getPrototypeOf(obj2).ename = 'Tom';
//console.log(obj2.ename);
//console.log(obj1.ename);

function Emp(s){
	this.salary = s;
}
var obj3 = new Emp(5000);
console.log(Object.getPrototypeOf(obj3));
console.log(Object.getPrototypeOf(obj3)===Object.getPrototypeOf(obj2));
