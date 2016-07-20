/*
字符串中的转义字符
*/

var s1 = 'AB\bCD';		//backspace
console.log( s1 );

var s2 = 'XY\nZ';		//nextline 下一行的当前位置
//var s2 = 'XY\u000AZ';
console.log( s2 );


var s3 = 'MN\rOP';		//return 回到当前行的开头
console.log( s3 );


var s4 = 'ab\tcd';		//table  跳到下一个水平制表符位置
console.log( s4 );		//八个英文字符的宽度
console.log();

console.log( 'a\tcd');
console.log( 'ab\tcd');
console.log( 'abc\tcd');
console.log( 'abcd\tcd');
console.log( 'abcde\tcd');
console.log( 'abcdef\tcd');
console.log( 'abcdefg\tcd');
console.log( 'abcdefgh\tcd');
console.log( 'abcdefghx\tcd');
console.log('姓名：\t\t'+123);
console.log('手机号：\t'+123);
console.log('个人签名：\t'+123);