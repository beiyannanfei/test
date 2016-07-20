var str = '';

for( var i=5; i<=40; i+=5){
	if( i==40){
		str = str + i;
	}else{
		str = str + i + '*';
	}
}

console.log( str );