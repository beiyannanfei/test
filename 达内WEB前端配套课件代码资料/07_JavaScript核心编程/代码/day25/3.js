/*
使用“冒泡排序算法”把一个数组中所有的元素
由小到大排练
*/

function bubbleSort( arr ){
	for(var i=0; i<arr.length; i++){
		for(var j=0; j<arr.length-i-1; j++){
			if(arr[j]>arr[j+1]){
				arr[j] = arr[j] + arr[j+1];
				arr[j+1] = arr[j] - arr[j+1];
				arr[j] = arr[j] - arr[j+1];
			}
		}
	}
}


var arr0 = [3, 2, 7, 5, 1];
bubbleSort( arr0 );
console.log( arr0 );	//[1,2,3,5,7]


/*
		3  2  7  5  1
0趟		2  3  5  1  7		length-1 是最大值
1趟		2  3  1  5  7		length-2 是剩余的最大值
2趟		2  1  3  5  7		length-3 是剩余的最大值
3趟		1  2  3  5  7		length-4 是剩余的最大值
4趟		1  2  3  5  7
*/




//var x = 10;
//var y = 20;
//交换两个变量的值
/*var tmp = x;
x = y;
y = tmp;*/
/*x = x + y;			
y = x - y;			
x = x - y;			
console.log(x);
console.log(y);*/