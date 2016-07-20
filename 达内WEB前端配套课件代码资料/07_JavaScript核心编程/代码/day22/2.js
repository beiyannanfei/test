var num1 = 10;
var num2 = 3;

num1 + num2 ;	//表达式，有运算的结果——值
var num3 = num1 + num2;	//两个表达式
console.log( num1 + num2 );

var num4 = num1 + num2 + num3;
console.log();

var num5 = -num1;
console.log( num1 );
console.log( num5 );	//-10
num5 = -num5;
num5 = -num5;
console.log( num5 );


var f1 = 0.2;
var f2 = 0.7;
console.log( f1 + f2 );



/**除法运算**/
var num10 = 10;	//number   double
var num11 = 4;	//number 
console.log( num10 / num11 );	//2.5
var num12 = 3;
console.log( num10 / num12 );	//3.333333333335
var num13 = 0;
console.log( 10 / 0 );			//Infinity

/**取余数/取模运算**/
console.log( 10 % 3 );	//1
console.log( 10 % 4 );	//2
console.log( -10 % 4 );	//-2
console.log( 10 % -4 );	//2
console.log( -10 % -4 );//-2
console.log();
console.log();


var num0 = 10;
//num0 = num0 + 1;
//num0++;
//++num0;
console.log( num0 );


console.log();
var i = 0;
//var j = i++;	//先取值、再自加
//var j = ++i;	//先自加、再取值
//console.log(i);
//console.log(j);

//console.log( i++ );
//console.log( ++i );