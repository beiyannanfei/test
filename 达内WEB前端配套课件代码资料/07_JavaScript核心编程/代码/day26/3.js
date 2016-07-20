/*
正则表达式中的 量词 —— 匹配字符出现的频次
*/

/*
//var regexp = /ab?/;
var regexp = /(ab)?/;		//使用()把多个字符看做一个小分组，是一个整体

var data = 'cdef';

console.log( regexp.test(data) );
*/


//var regexp = /ab*/;
//var regexp = /(ab)*/;
//var data = 'abababcdef';
//console.log( regexp.test(data) );


//var regexp = /ab+/;
//var regexp = /(ab)+/;
//var data = 'abababcdef';
//console.log( regexp.test(data) );

/*
var regexp = /ab{3}/;
var data = 'abbbbcdef';
console.log( regexp.test(data) );
*/


//var regexp = /ab{2,4}/;
var regexp = /(ab){2,4}/;
var data = 'ababdef';
console.log( regexp.test(data) );
