console.log(Object.prototype);

var obj1 = new Object();
console.log(Object.getPrototypeOf(obj1)===Object.prototype);

var obj2 = {};
console.log(Object.getPrototypeOf(obj2)===Object.prototype);


function Emp(){}
var obj3 = new Emp();
