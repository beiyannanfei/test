/*
格式化输出当前系统时间、
当前时间1小时后的时间、
当前时间24小时后的时间、
当前时间所在的24点的时间、
当前时间3个工作日后的营业开始时间(9点)
*/

function format( d ){
	var year = d.getFullYear();
	var month = d.getMonth()+1;
	var date = d.getDate();
	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();

	month = month<10 ? '0'+month : month;
	date = date<10 ? '0'+date : date;
	hour = hour<10 ? '0'+hour : hour;
	minute = minute<10 ? '0'+minute : minute;
	second = second<10 ? '0'+second : second;
	return year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second;
}

//格式化输出当前系统时间、
var d1 = new Date();
console.log( format(d1) );

//当前时间1小时后的时间
var d2 = new Date(d1.getTime()+1000*3600);
console.log( format(d2) );

//当前时间24小时后的时间、
var d3 = new Date(d1.getTime()+1000*3600*24);
console.log( format(d2) );

//当前时间所在的24点的时间
//var d4 = d1;		//并没有创建新的Date对象
//d4.setHours( 1 );
//console.log( d1.getHours());
var d5 = new Date(  d1.getTime()  );
d5.setHours(24);
d5.setMinutes(0);
d5.setSeconds(0);
console.log(d5);