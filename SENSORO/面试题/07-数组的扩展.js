/**
 * Created by wyq on 17/8/9.
 */
function t1() {
	let arr = [1, 2, 3];
	console.log("%j", ...arr);  //1 2 3  将一个数组转为用逗号分隔的参数序列
}

function t2() {
	let m = Math.max(...[14, 3, 77]);   // <=> Math.max(14, 3, 77);
	console.log("m = %j", m);

	var arr1 = [0, 1, 2];
	var arr2 = [3, 4, 5];
	arr1.push(...arr2);   // <=> var arr1 = arr1.concat(arr2);
	console.log("arr1 = %j", arr1); //arr1 = [0,1,2,3,4,5]
}

function t3() {
	let arrLike = {0: "a", 1: "b", 2: "c", "length": 3};
	let arr1 = Array.from(arrLike); //Array.from方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括ES6新增的数据结构Set和Map）
	console.log("arr1 = %j", arr1); //arr1 = ["a","b","c"]

	let arr2 = Array.from("hello");
	console.log("arr2 = %j", arr2); //arr2 = ["h","e","l","l","o"]

	let arr3 = Array.from({length: 3});
	console.log("arr3 = %j", arr3); //arr3 = [null,null,null]

	let arr4 = Array.from([1, 2, 3], (x) => x * x);
	console.log("arr4 = %j", arr4); //arr4 = [1,4,9]

	let arr5 = Array.from([1, false, 2, null, 3, undefined, , 4], (n) => n || 0);
	console.log("arr5 = %j", arr5); //arr5 = [1,0,2,0,3,0,0,4]

	let arr6 = Array.from({length: 2}, () => 'jack');
	console.log("arr6 = %j", arr6); //arr6 = ["jack","jack"]
}
t3();



