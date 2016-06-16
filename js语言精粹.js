/**
 * Created by wyq on 2016/6/14.
 */

var _ = require("underscore");
var add = function (a, b) {
	return a + b;
};

//方法调用模式
console.log("===================== 方法调用模式 =====================");
var myObject = {
	value: 0,
	increment: function (inc) {
		this.value += typeof inc === "number" ? inc : 1;
	}
};
myObject.increment();
console.log(myObject.value);        //1
myObject.increment(2);
console.log(myObject.value);        //3

//函数调用模式
console.log("===================== 函数调用模式 =====================");
myObject.double = function () {
	var that = this;
	var helper = function () {
		that.value = add(that.value, that.value);
	};
	helper();
};
myObject.getValue = function () {
	return this.value;
};

myObject.double();
console.log(myObject.getValue());

//构造器调用模式
console.log("===================== 构造器调用模式 =====================");

//创建一个名为Quo的构造器函数，它构造一个带有status属性的对象
var Quo = function (string) {
	this.status = string;
};
//给Quo的所有实例提供一个名为get_status的公共方法
Quo.prototype.get_status = function () {
	return this.status;
};
//构造一个Quo实例
var myQuo = new Quo("confused");
console.log(myQuo.get_status());

//Apply调用模式
console.log("===================== Apply调用模式 =====================");

var array = [3, 4];
var sum = add.apply(null, array);
console.log(sum);

var statusObject = {
	status: "A-OK"
};
var status = Quo.prototype.get_status.apply(statusObject);
console.log(status);

//给类型增加方法
console.log("===================== 给类型增加方法 =====================");

Function.prototype.method = function (name, func) {
	this.prototype[name] = func;
	return this;
};
Number.method("integer", function () {
	return Math[this < 0 ? 'ceil' : 'floor'](this);
});
console.log((-10 / 3).integer());       //-3

//伪类
console.log("===================== 伪类 =====================");

var A = function () {
};
A.prototype.abc = function (str) {
	return "Hello " + str;
};
console.log(new A().abc("wyq"));
console.log(_.keys(A.prototype));
console.log(A.prototype);




















































