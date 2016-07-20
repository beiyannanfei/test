var regexp1 = /\d\//gi;
var regexp2 = new RegExp('\\d\\/', 'gi');

console.log( typeof regexp1 );
console.log( typeof regexp2 );
console.log( regexp1 instanceof RegExp );
console.log( regexp2 instanceof RegExp );
console.log();


console.log( regexp1.ignoreCase );
regexp1.ignoreCase = false;  //只读属性，修改无效
console.log( regexp1.ignoreCase );
console.log( regexp1.global );
console.log( regexp1.multiline );
console.log();


console.log( regexp1.source );
console.log( regexp2.source );