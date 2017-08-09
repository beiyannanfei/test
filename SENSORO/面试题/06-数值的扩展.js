/**
 * Created by wyq on 17/8/8.
 */
function t1() {
	console.log(Math.trunc(123.456)); //123 去除一个数的小数部分，返回整数部分
}

function t2() {
	let x = 99;
//参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的
	function foo(p = x + 1) {
		console.log(p);
	}

	foo();    //100
	x = 100;
	foo();    //101
}

function t3() {

}
t3();
