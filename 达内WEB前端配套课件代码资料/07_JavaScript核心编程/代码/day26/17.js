var regexp = /<([a-z1-6]+)\/>/i;


var data = '<hr/>';

console.log( regexp.test(data) );
console.log( RegExp.$1 );
console.log();



/*
判定一个字符串是否为合法的邮箱字符串
若合法，则输出其中的用户名和域名
*/
var emailPatt = /^(\w+)@([\w.]+)$/i;

var input = 'tom@tedu.cn';
if( emailPatt.test(input) ){
	console.log('用户名'+RegExp.$1);
	console.log('域名名'+RegExp.$2);
}else{
	console.log('邮箱格式非法');
}
