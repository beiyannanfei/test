/**
Date对象类型的使用
**/
var d1 = Date();	//初始化为客户端当前时间
console.log(d1);
console.log( typeof d1);  //string

var d2 = new Date();  //初始化为客户端当前时间
console.log(d2);
console.log( typeof d2);  //object

var d3 = new Date(2000,0,1);  //月0~11
console.log(d3);

var d4 = new Date(2015,2,18,22,15,9);  //月0~11
console.log(d4);

var d5 = new Date('2015-2-28');
console.log(d5);

var d6 = new Date('2015/2/28');
console.log(d6);

//var d7 = new Date('2015年2月28日');
//console.log(d7);

var d8 = new Date('2/28/2015');
console.log(d8);

var d9 = new Date('2015/2/28 22:23:24');
console.log(d9);

var d10 = new Date(1000*3600*24*365);
console.log(d10);

/*
var d11 = new Date(Number.MAX_VALUE);
console.log(d11);
*/
var t = d2.getTime();
console.log(t);
console.log();


console.log(d2.getYear());
console.log(d2.getFullYear());
console.log(d2.getMonth());
//console.log(d2.getDay());
console.log(d2.getDate());
console.log(d2.getHours());
console.log(d2.getMinutes());
console.log(d2.getSeconds());
console.log(d2.getMilliseconds());
console.log();

console.log(d2.toDateString());
console.log(d2.toTimeString());
console.log(d2.toLocaleDateString());
console.log(d2.toLocaleTimeString());
console.log(d2.toString());
console.log(d2.toTimeString());
console.log(d2.toUTCString());	//GMT  UTC
