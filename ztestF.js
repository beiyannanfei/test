let obj = {};
let a = true;
a && (obj.a = 10) && (obj.b = 20);
console.log(obj);