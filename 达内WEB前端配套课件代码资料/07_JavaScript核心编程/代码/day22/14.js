function max(x, y, z){
	var m = x>y ? x : y;
	return m>z ? m : z;
}

var result = max( 1, 5, 2);
console.log( result );