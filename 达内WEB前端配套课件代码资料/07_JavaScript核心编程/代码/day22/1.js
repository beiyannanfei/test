var s1 = '\'abc\'\n\u4e00二三\\';
console.log( typeof(s1) );	//string
console.log(s1);

var n1 = 123;				//number
var n2 = 0123;
var n3 = 0x123;
var n4 = 123.45;
var n5 = 1.2345e2;

var b1 = true;				//boolean
var b2 = false;

自动转换：
	'10'+10;	'10'+true;	 10+true;  true+true;
	if(123){}
强制转换：
	var n5 = 123;		n5.toString();
	var b5 = true;		b5.toString();
	var s5 = 'a123.45abc';
	parseInt(s5);	//NaN
	parseFloat(s5);	//NaN


var f1;
console.log(f1);
