
var names = ['Mary', 'John'];

function getElementIndex(arr, e){
	var i = 0;
	for(; i<arr.length; i++){
		if( arr[i] === e ){
			break;
		}
	}

	if(i>=arr.length){
		return -1;
	}else{
		return i;
	}
}


getElementIndex(names, 'Tom');