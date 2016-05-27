/**
 * Created by wyq on 2016/5/24.
 */
var util = require('util');
var JI = require("./a.js");

var zi = function (arg1, arg2) {
	console.log("zi arg1: %j, arg2: %j", arg1, arg2);
	this.arg1 = arg1;
	this.arg2 = arg2;
	JI.call(this, arg1, arg2);
};

util.inherits(zi, JI);  //正常

module.exports = zi;

zi.prototype.show = function () {
	console.log("zi show arg1: %j, arg2: %j", this.arg1, this.arg2);
};

//util.inherits(zi, JI);  //如何在这里继承的话基类的方法就会覆盖子类的同名方法
