//声明/定义一个函数/功能体
function printNumber(){
	console.log(1);
	console.log(2);
	console.log(3);
}


//调用/使用函数——执行功能体中的所有语句
printNumber();
printNumber();
printNumber();



//定义需要接收参数的函数
function add1(num1, num2){   //num1/num2形式参数
	num1++;
	//num2++;
	console.log(num1 + num2);
}

//调用函数
add1(10, 20);		//num1=10; num2=20  实际参数
add1(10, 20, 30);	//num1=10; num2=20
add1(10);			//num1=10; num2=undefined

var a = 100;
var b = 200;
add1(a, b);			//num1=a;  num2=b;

var r = add1('abc', 'xyz');	//num1='abc'; num2='xyz'
console.log('add1函数的返回值'+r);


//定义可以有返回值的函数
function add2(n1, n2){
	var sum = n1+n2;
	return sum;		//return是整个函数的最后一句
	//console.log(123);
}

var x = add2(11, 22);  //使用变量接收函数的返回值
console.log( x );