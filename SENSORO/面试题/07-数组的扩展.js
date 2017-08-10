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

function t4() {
	let arr = [1, 5, 10, 15];
	let a = arr.find((value, index, arr) => {
		/*              值     下标   原数组
		 1 0 [ 1, 5, 10, 15 ]
		 5 1 [ 1, 5, 10, 15 ]
		 10 2 [ 1, 5, 10, 15 ]
		 15 3 [ 1, 5, 10, 15 ]
		 */
		console.log(value, index, arr);
		return value > 10;
	});
	console.log("a = %j", a); //a = 15
}

function t5() {
	let arr = [1, 5, 10, 15];
	let aIn = arr.findIndex((value, index, arr) => {  //返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1
		return value > 10;
	});
	console.log("aIn = %j", aIn); //aIn = 3
}

function t6() {
	let aIndex = [NaN].indexOf(NaN);      //indexOf不能发现NaN
	console.log("aIndex = %j", aIndex); //aIndex = -1
	let bIndex = [NaN].findIndex(val => { //findIndex方法可以借助Object.is方法做到识别NaN
		return Object.is(NaN, val);
	});
	console.log("bIndex = %j", bIndex); //bIndex = 0
}

function t7() {
	var arr1 = ["a", "b", "c"];
	arr1.fill(7); //fill方法使用给定值，填充一个数组
	console.log("arr1 = %j", arr1); //arr1 = [7,7,7]
}

function t8() {
	let arr = ["a", "b", "c"];
	for (let index of arr.keys()) { //keys()是对键名的遍历
		console.log("index = %j", index);//index = 0		index = 1		index = 2
	}
	console.log("==================");
	for (let value of arr) {
		console.log("value = %j", value); //value = "a"		value = "b"		value = "c"
	}
	console.log("==================");
	for (let [index, value] of arr.entries()) { //entries()是对键值对的遍历
		console.log(`index = ${index}, value = ${value}`);
		//index = 0, value = a		index = 1, value = b		index = 2, value = c
	}
}

function t9() {
	let isHas1 = [1, 2, 3].includes(2);
	console.log(`isHas1 is ${isHas1}`); //isHas1 is true

	let isHas2 = [1, 2, NaN, 3].includes(NaN);
	console.log(`isHas2 is ${isHas2}`); //isHas2 is true

	let isHas3 = [1, 2, 3, 4].includes(1, 1); //该方法的第二个参数表示搜索的起始位置，默认为0。如果第二个参数为负数，则表示倒数的位置
	console.log(`isHas3 is ${isHas3}`); //isHas3 is false
}





