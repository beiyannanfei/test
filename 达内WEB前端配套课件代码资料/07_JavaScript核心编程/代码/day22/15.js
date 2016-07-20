function f1(){
	//console.log(1);
	var i = 10;			//局部变量
	i++;
	console.log(i);
}

f1();
f1();
f1();


//console.log( i );
console.log();

var sum = 10;		//全局变量

function f2(){
	//var sum = 20;	//局部变量在函数体内覆盖了全局变量
	sum++;
}
f2();
f2();
f2();
console.log( sum );
