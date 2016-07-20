var d1 = new Date();

console.log( d1 );
console.log( d1.toString() );
console.log( d1.toDateString() );
console.log( d1.toLocaleDateString() );
console.log( d1.toTimeString() );
console.log( d1.toLocaleTimeString() );

//参数fmt中可以包含几个特别的字符yyyy MM dd HH mm ss
Date.prototype.format = function(fmt){
	if(!fmt){
		return undefined;
	}
	var year = this.getFullYear();
	var month = this.getMonth()+1;
	var date = this.getDate();
	var hour = this.getHours();
	var minute = this.getMinutes();
	var second = this.getSeconds();

	month = month<10 ? '0'+month : month;
	date = date<10 ? '0'+date : date;
	hour = hour<10 ? '0'+hour : hour;
	minute = minute<10 ? '0'+minute : minute;
	second = second<10 ? '0'+second : second;

	fmt = fmt.replace('yyyy', year);
	fmt = fmt.replace('MM', month);
	fmt = fmt.replace('dd', date);
	fmt = fmt.replace('HH', hour);
	fmt = fmt.replace('mm', minute);
	fmt = fmt.replace('ss', second);
	return fmt;
};

console.log();
console.log( d1.format() );
console.log( d1.format('yyyy') );
console.log( d1.format('yyyy-MM-dd') );
console.log( d1.format('yyyy年MM月dd日') );
console.log( d1.format('yyyy/MM/dd') );
console.log( d1.format('yyyy/MM/dd HH:mm:ss') );
console.log( d1.format('yyyy/MM/dd HH:mm') );
