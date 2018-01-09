/**
 * Created by wyq on 18/1/9.
 */
function cloneDeep(obj) {  //不含有函数的借助JSON反解析
	let cloneObj = JSON.parse(JSON.stringify(obj));
}

function cloneDeep1(obj1, obj2) {
	obj1 = obj1 || {};
	for (let k in obj2) {
		if (!obj2.hasOwnProperty(k)) {
			continue;
		}
		if (typeof obj2[k] === "object") {
			obj1[k] = Array.isArray(obj2[k]) ? [] : {};
			cloneDeep1(obj1[k], obj2[k]);
		}
		else {
			obj1[k] = obj2[k];
		}
	}
}

let a = {
	a: 10,
	b: "bbb",
	c: [1, 2, 3, 4],
	d: {
		d1: 10,
		d2: "dbbbb"
	},
	e: {
		a: 10,
		b: "bbb",
		c: [1, 2, 3, 4],
		d: {
			d1: 10,
			d2: "dbbbb"
		}
	}
};

let b = {};
cloneDeep1(b, a);
console.log(b);

