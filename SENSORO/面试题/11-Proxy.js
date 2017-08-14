/**
 * Created by wyq on 17/8/14.
 */
function t1() {
	let proxy = new Proxy({a: 10}, {
		get: (target, property) => {
			console.log("target: %j, property: %j", target, property);
			return 35;
		}
	});
	let time = proxy.time;              //target: {"a":10}, property: "time"
	console.log("time = %j", time);     //time = 35
	let name = proxy.name;              //target: {"a":10}, property: "name"
	console.log("name = %j", name);     //name = 35
	let title = proxy.title;            //target: {"a":10}, property: "title"
	console.log("title = %j", title);   //title = 35
}

function t2() {
	let target = {};
	let handler = {};
	let proxy = new Proxy(target, handler); //如果handler没有设置任何拦截，那就等同于直接通向原对象。
	proxy.a = 10;
	console.log("target = %j", target);
	console.log("handler = %j", handler);
	console.log("=========================");

	let target1 = {a: 10};
	let proxy1 = new Proxy(target1, {
		get: (target, property) => {
			console.log("target: %j, property: %j", target, property);
			return "1001";
		}
	});
	proxy1.b = 20;
	proxy1.c = 30;
	let time = proxy1.time;   //target: {"a":10,"b":20,"c":30}, property: "time"
	console.log("time = %j, target1 = %j", time, target1);  //time = "1001", target1 = {"a":10,"b":20,"c":30}
}

