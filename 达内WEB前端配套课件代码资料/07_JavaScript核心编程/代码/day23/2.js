var age = 10;

function add(n1, n2){
	var a = 10;
	{
		var x = 9999;
	}
	var sum = 0;	//局部变量
	sum += x;
	sum += n1;
	sum += age;
	sum += n2;
	return sum;
}

var result = add(1, 2);
console.log(result);
//console.log(sum);