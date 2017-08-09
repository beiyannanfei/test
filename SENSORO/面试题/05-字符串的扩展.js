/**
 * Created by wyq on 17/8/8.
 */
function t1() {
	for (let code of "foo") {
		console.log(code);  //f o o
	}
}

function t2() {
	let str = "Hello world!";
	console.log(str.startsWith("H")); //true
	console.log(str.endsWith("!"));   //true
	console.log(str.includes("d"));   //true

	console.log(str.includes("e", 2));   //false  第二个参数表示开始搜索位置
}

function t3() { //repeat方法返回一个新字符串，表示将原字符串重复n次
	console.log("x".repeat(5));   //xxxxx

	// console.log('x'.padStart(5, "ab"));  浏览器支持,node不支持操作
	// console.log('x'.padEnd(5, 'ab'));
}
t3();




