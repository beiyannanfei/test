/*
控制台中输出20个小于100的能够被3或4整除的自然数
*/

var counter = 0;	//满足条件的自然数的数量

for(var i=1; i<100; i++){
	if( (i%3==0) || (i%4==0) ){
		console.log( i );
		counter++;
	}

	if(counter==20){
		break;
	}
}