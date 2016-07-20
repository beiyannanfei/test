var i = 10;
var j = 3;

console.log( i>j );
console.log( i>=j );
console.log( i<j );
console.log( i<=j );
//console.log( i=j );
console.log( i==j );
console.log( i!=j );

var k = 1.5;
var f = true;
console.log( i>=f );

var s1 = 'abc';
var s2 = 'abd';
console.log( s1 < s2 );	//String比较的是Unicode


console.log();
var num1 = 300;
var str1 = '31';
console.log( num1 > str1 );	//true

var num2 = 3;
var str2 = '3';
console.log( num2 == str2 ); //自动转换
console.log( num2 === str2 ); //不作类型转换