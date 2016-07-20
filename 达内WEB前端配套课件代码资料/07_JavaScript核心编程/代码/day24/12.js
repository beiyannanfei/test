/*打印100以内的质数*/

for(var i=2; i<100; i++){

	var j=2
	for(; j<i; j++){
		if( i%j == 0 ){
			break;
		}		
	}
	if(j>=i){	//说明上面的内侧循环直到退出也没找到能够整除的数
		console.log( i );
	}else{	//break被执行了
	}
}