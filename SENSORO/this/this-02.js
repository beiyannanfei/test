/**
 * Created by wyq on 17/7/14.
 */
var name = "XL";
var person = {
	name: "xl",
	showName: function () {
		console.log(this.name);
	}
};
person.showName();  //xl 这里是person对象调用showName方法，很显然this关键字是指向person对象的，所以会输出name

var showNameA = person.showName;
let person2 = {
	name: "xl2"
};
showNameA.call(person2);

console.log("=======================");

var pA = {
	name: "xl",
	show: function () {
		console.log(this.name);
	}
};

var pB = {
	name: "XL",
	say: pA.show
};

pB.say();//输出 XL



