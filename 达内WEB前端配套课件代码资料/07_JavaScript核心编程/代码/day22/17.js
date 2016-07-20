/*
*使用递归方法计算num的累加和
*/
function recursiveAdd( num ){
	var sum = 0;
	if( num >= 1){
		sum = num + recursiveAdd(--num); 
	}
	return sum;
}

console.log( recursiveAdd( 3 ) );