/*
创建一个函数，接收一个十进制的整数，
返回其对应的N进制数表示
num: 十进制整数
ohter：待转换为的进制，如2、8、16
*/

function decimalToOther(num, other){
	var stack = [];
	while( num>0 ){
		var yuShu = num%other;	//余数
		num = parseInt(num/other); //商
		stack.push( yuShu );
	}
	stack.reverse();
	return stack.join('');	//用空白字符拼接每个元素
}


console.log( decimalToOther(19, 2) );
console.log( decimalToOther(19, 8) );
