var emp = {ename:'tom'};

var coder1 = Object.create(emp);
var coder2 = Object.create(emp);

console.log(coder1.ename);	//原型属性
console.log(coder2.ename);	//原型属性

emp.ename = 'tommy';
Object.getPrototypeOf(coder1).ename = 'TomCruise';

console.log(coder1.ename);	//原型属性
console.log(coder2.ename);	//原型属性(PrototypeProperty)
console.log();

coder1.salary = 8000;		//自有属性(OwnProperty)
console.log(coder1.salary);
console.log(coder2.salary);
console.log(emp.salary);
console.log();

coder1.ename = 'Mary';		//自有属性覆盖了原型属性
console.log(coder1.ename);
console.log(coder2.ename);
console.log(emp.ename);



