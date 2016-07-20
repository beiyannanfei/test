var arr = [9, 15, 3, 22, 51];


//console.log( arr.sort() );   
//默认情况下，会把所有元素转换为字符串，比较unicode

function compare(a, b){
	a = parseInt( a );
	b = parseInt( b );
	if( a<b) {
		return -1;
	}else if( a>b ){
		return 1;
	}else{
		return 0;
	}
}
//sort()方法的参数是一个“函数”
console.log( arr.sort( compare ) );
