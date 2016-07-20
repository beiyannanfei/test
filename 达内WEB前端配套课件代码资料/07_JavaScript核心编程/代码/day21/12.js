//JS中的自动类型转换
var x = 1;
var y = 2;
console.log( x + y );

var z = 'A';
console.log( x + z );	//number自动转换为string

var b = true;
console.log( b + z );	//boolean自动转换为string

console.log( y + b );	//number+boolean 