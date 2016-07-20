//JS中的强制类型转换
var pi = 3.14;
console.log( typeof(pi) );

var s = pi.toString();	//把number强制转换为string
console.log( typeof(s) + s );

var isOnDuty = true;
var s2 = isOnDuty.toString(); //把number强制转换为string
console.log( typeof s2 );

var str1 = 'M1Y2b3A4.56';
var num1 = parseInt(str1); //把string强制解析为number
console.log( num1 + 1 );

var str2 = 'M1234.56';
var num2 = parseFloat(str2); //把string强制解析为float
console.log( num2 );