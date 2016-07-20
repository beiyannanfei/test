var data = [
	'傲慢与偏见',
	'德伯',
	35.5,
	true,
	new Date(2001,1,2)
];

console.log( data );	//默认就调用了valueOf()
console.log( data.valueOf() );
console.log( data.toString() );
console.log( data.toLocaleString() );
console.log( data.join() );
console.log( data.join('###') );
console.log( data.join('</td><td>') );