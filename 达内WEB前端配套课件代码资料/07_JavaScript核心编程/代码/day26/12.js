/*
邮箱判定正则表达式
*/

var emailPatt = /^[\w-]+@[\w-]+\.[a-z]+(\.[a-z]+)?$/i;


var data = 'tom@123.com';
console.log( emailPatt.test(data) );