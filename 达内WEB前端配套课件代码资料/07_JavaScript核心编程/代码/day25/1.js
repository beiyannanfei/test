
/*
找出数组中的最大值
*/
function getMax( arr ){
	var max = 0;		//Object.keys(arr)
	for( var k in arr ){
		if( max<=arr[k] ){
			max = arr[k];
		}
	}
	return max;
}


