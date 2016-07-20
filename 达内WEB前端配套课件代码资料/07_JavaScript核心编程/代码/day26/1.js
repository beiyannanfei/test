var s1 = 'abc';
var s2 = new String('abc');
console.log(s1.length);
console.log(s2.length);
console.log(s2.toUpperCase());
console.log(s2.toUpperCase());

//区别
console.log( typeof(s1) === 'string' );
console.log( typeof(s2) === 'object' );
console.log();

console.log( s1 instanceof String );
console.log( s2 instanceof String );
console.log( s1 instanceof Object );
console.log( s2 instanceof Object );

console.log( Object.getPrototypeOf(s2) ); //获取s2的父对象(原型)
console.log( Object.getPrototypeOf(s1) ); //获取s1的父对象(原型)



function f1(s){
}