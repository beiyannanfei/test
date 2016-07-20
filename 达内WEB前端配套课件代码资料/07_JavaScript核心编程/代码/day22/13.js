function add(num1, num2){
	var sum = num1 + num2;
	return sum;
}

var x = add(1, 2);		
console.log( x );
//console.log( num1 );	//错误
//console.log( sum );	//错误


function isLeapYear( year ){
	var result = (year%4==0 && year%100!=0) 
					|| 
				 (year%400==0);
	return result;
}
var y = 2001;
var r = isLeapYear(y);	//year=y;
console.log( r );

console.log();
console.log( isLeapYear(2008) );
console.log( isLeapYear(2010) );
console.log( isLeapYear(2012) );