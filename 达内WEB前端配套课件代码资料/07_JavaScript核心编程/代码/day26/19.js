var phonePatt = /1[35789]\d{9}/g;

var msg = '这是我的电话13012345678这是tom的电话138012345679999';

//摘取上述字符串中所有的手机号码

/*
console.log(  phonePatt.exec(msg) );
console.log(  phonePatt.exec(msg) );
console.log(  phonePatt.exec(msg) );
console.log(  phonePatt.exec(msg) );
*/

var result = null;
while( (result=phonePatt.exec(msg))!=null  ){
	console.log( result[0] );
}