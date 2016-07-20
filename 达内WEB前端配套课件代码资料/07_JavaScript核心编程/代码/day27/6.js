var n1 = 123;	//值类型
var n2 = new Number(123);  //引用类型对象
var n3 = new Number('123.45'); 		//
//var n4 = new Number('123.45ab'); 	//

console.log( typeof n1 );
console.log( typeof n2 );

console.log( n1 instanceof Number );
console.log( n1 instanceof Object );
console.log( n2 instanceof Number );
console.log( n2 instanceof Object );
console.log();


console.log(n1);
var n3 = new Number('123.45a');
console.log(n3);

var n4 = Number('123');
console.log( typeof n4 );

console.log();
console.log( Number.NaN );
console.log( Number.MAX_VALUE );
console.log( Number.MIN_VALUE );
var n5 = Number.MAX_VALUE + 1;
n5 = Number.MAX_VALUE + Number.MAX_VALUE;
console.log( n5 );
console.log( Number.POSITIVE_INFINITY );
console.log( Number.NEGATIVE_INFINITY );

