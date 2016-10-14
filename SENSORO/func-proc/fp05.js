// 声明式与命令式代码
var companies = [];
for (var i = 0; i < 3000; ++i) {
	companies.push(i);
}

function f1() {   //命令是代码
	console.time("f1");
	var ceos = [];
	companies.forEach(item => {
		ceos.push("item: " + item);
	});
	console.timeEnd("f1");
	// console.log(ceos);
}

f1();

function f2() {   //声明式
	console.time("f2");
	var ceos = companies.map(function (c) {
		return "item: " + c;
	});
	console.timeEnd("f2");
	// console.log(ceos);
}

f2();

