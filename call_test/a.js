/**
 * Created by wyq on 2016/5/24.
 */

var ji = function (arg1, arg2) {
	console.log("ji arg1: %j, arg2: %j", arg1, arg2);
	this.arg1 = arg1;
	this.arg2 = arg2;
};

module.exports = ji;

ji.prototype.show = function () {
	console.log("ji show arg1: %j, arg2: %j", this.arg1, this.arg2);
};