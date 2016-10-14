/**
 * Created by sensoro on 16/8/26.
 */
var sinon = require('sinon');
var myFunc = require("./myFunc.js");

var stub;
exports.startStub = function () {
	stub = sinon.stub(myFunc, "test", function (num, cb) {
		if (num) {
			return cb("startStub err");
		}
		return cb(null, "startStub ok");
	});
};

exports.stopStub = function () {
	if (stub && stub.restore) {
		stub.restore();
	}
};

exports.okStub = function () {
	stub = sinon.stub(myFunc, "test", function (num, cb) {
		return cb(null, "okStub");
	});
};

exports.errStub = function () {
	stub = sinon.stub(myFunc, "test", function (num, cb) {
		return cb("errStub");
	});
};