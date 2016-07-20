var i1 = 10;	//全局变量

function f1(){
	var i2 = 20;	//局部变量--块级变量
	console.log( i1 );
	console.log( i2 );
	if( i2>0 ){
		var i3 = 30;	//局部变量
		console.log( i3 );
	}
	//console.log( i3 );
}

//console.log( i2 );


const pi = 3.14;
pi++;
console.log(pi);