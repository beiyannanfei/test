var s1 = '456.789abc';

var n1 = Number(s1);

console.log( typeof s1 );
console.log( typeof n1 );

//console.log( NaN == NaN );  //false

//console.log(  isNaN(n1)  );
if( isNaN(n1) ){
	console.log('您输入的工资数非法');
}else{
	console.log('您输入的工资数有效的'+n1);
}

