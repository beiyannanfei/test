function ltrim(str){
	var regexp = /^\s*/;
	var result = str.replace(regexp, '');
	return result;
}

function rtrim(str){
	var regexp = /\s*$/;
	var result = str.replace(regexp, '');
	return result;
}

function trim(str){  
	var regexp = /^\s*|\s*$/g;
	var result = str.replace(regexp, '');
	return result;
}

var data = '  \n\tA  B  \n\t';
console.log('||'+data+'||');
console.log('||'+ltrim(data)+'||');
console.log('||'+rtrim(data)+'||');
console.log('||'+trim(data)+'||');