function printLeapYear( year ){
	var isLeapYear = (year%4==0 && year%100!=0) || (year%400==0)
	if( isLeapYear ){
		console.log(year+'的二月份有29天');
	}
}

printLeapYear(2001);



//个税计算器
function getPersonalTax( salary ){
	var tax = 0;	//个税值
	if(salary >= 9000){
		tax += (salary-9000)*0.2;
		salary = 9000;
	}
	
	if(salary >= 5000 ){
		tax += (salary-5000)*0.1;
		salary = 5000;
	}

	if(salary >= 3500 ){
		tax += (salary-3500)*0.03;
	}

	return tax;
}

var t = getPersonalTax(6000);
console.log( t );




