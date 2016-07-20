/*
Math类型中的属性——都是静态属性
*/

console.log(  Math.PI  );
console.log(  Math.E  );
console.log(  Math.SQRT2  );
console.log(  Math.SQRT1_2  );
console.log();


console.log( Math.abs(-5) );
console.log( Math.exp(2) );
console.log( Math.sqrt(9) );
console.log( Math.pow(5,3) );


var a = 10;
var b = 1;
console.log( a>b ? a : b );
console.log( Math.max(a,b) );
console.log( Math.min(a,b) );
console.log();
//四舍五入——到整数位
console.log( Math.round(1.234567) );
console.log( Math.round(1.4) );
console.log( Math.round(1.5) );
//console.log( parseInt(1.9) );
console.log( Math.round(-1.5) ); //-1  
console.log( Math.round(-1.4) ); //-1
console.log( Math.round(-1.6) ); //-2
console.log( Math.round(-1.51) ); //-2
console.log();

//上取整：ceil() 取不小于指定值的最小值
console.log(Math.ceil(2));
console.log(Math.ceil(1.5));
console.log(Math.ceil(1.1));
console.log(Math.ceil(1.01));

//下取整：floor() 取不大于指定的最大值
console.log(Math.floor(2));
console.log(Math.floor(2.1));
console.log(Math.floor(2.5));
console.log(Math.floor(2.9));
console.log();

console.log( Math.sin(Math.PI/6) );
console.log( Math.sin(Math.PI/3) );
console.log( Math.cos(Math.PI/3) );
console.log( Math.cos(Math.PI/6) );
console.log();

//返回一个伪随机数  0<=r<1
console.log( Math.random() );
console.log( Math.random()*10 );	//0<=r<10
console.log( Math.random()*100 );	//0<=0<100
console.log( parseInt(Math.random()*100) );	//0<=0<100

//产生随机的三位整数  100~1000   1000-100
/*
0<=r<1
0<=r*900<900
100<=r*900+100<1000
m<=r*(n-m)+m<n 
*/
console.log( );
console.log( parseInt(Math.random()*(1000-100))  + 100);
console.log( parseInt(Math.random()*(1000-100))  + 100);
console.log( parseInt(Math.random()*(1000-100))  + 100);
console.log( parseInt(Math.random()*(1000-100))  + 100);
console.log( parseInt(Math.random()*(1000-100))  + 100);
console.log( parseInt(Math.random()*(1000-100))  + 100);