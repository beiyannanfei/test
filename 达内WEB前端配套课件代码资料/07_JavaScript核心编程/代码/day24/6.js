/*
打印出所有的水仙花数
水仙花数是这样的一个三位数，
其各个位上的数字的立方和等于这个数本身，
如 153 = 1*1*1 + 5*5*5 + 3*3*3
*/
for( var i=100; i<1000; i++){
	var baiWei = parseInt(i/100);
	var shiWei = parseInt(i/10%10);
	var geWei = i%10;
	if( i == baiWei*baiWei*baiWei + shiWei*shiWei*shiWei + geWei*geWei*geWei){
		console.log( i );
	}
}


