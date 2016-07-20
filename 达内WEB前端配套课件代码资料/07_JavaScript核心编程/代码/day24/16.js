var arr1 =  [];
arr1[0] = '西游记';
arr1[1] = '施耐庵';
arr1[2] = 36.5;
arr1[3] = '机械工业出版社';

//使用for循环变量 索引数组
for( var i=0; i<arr1.length; i++){
	console.log( i + '=>' + arr1[i] );
}

//使用for..in..循环遍历 索引数组
for(var key in arr1){
	console.log( key + '=>' + arr1[key] );
}

console.log();


//关联数组
var arr2 = [];
arr2['bookName'] = '三国演义';		
arr2['author'] = '罗贯中';
arr2['price'] = 38.5;
arr2['publisher'] = '清华大学出版社';
console.log( arr2.length );	//0

for( var k in arr2){
	console.log(k + '=>' + arr2[k]);
}