/*
采用面向对象的方式，
裁剪掉一个字符串对象的前导的所有空白字符
*/
var s1 = new String('  A  B  ');
//s1.ltrim = function(){
String.prototype.ltrim = function(){
	var regexp = /^\s*/;
	var result = this.replace(regexp, '');
	return result;
};
console.log('||'+s1.ltrim()+'||');