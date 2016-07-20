/*
年存款利率为3%，本金为10000，
存款总额超过12000时收益具体是多少？
*/

var total = 10000;

while( total<=12000 ){
	total = total+total*0.03;
}

console.log( total );