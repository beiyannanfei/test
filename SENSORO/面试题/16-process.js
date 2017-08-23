/**
 * Created by wyq on 17/8/21.
 */
function t1() {
	function test() {
		console.log("=====");             //死循环
		process.nextTick(() => test());
	}

	test();
}

function t2() {
	function test() {
		console.log("=====");
		setTimeout(() => test(), 0);
	}

	test();
	while (1) {
	}
}
t1();