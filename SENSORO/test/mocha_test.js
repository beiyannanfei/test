/**
 * Created by sensoro on 16/8/26.
 */
var myFunc = require("./myFunc.js");
var mySinon = require("./sinon_test.js");

///Users/sensoro/bynf/test/SENSORO   mocha test/mocha_test.js (上一级目录名称必须为test, 其它文件名均会出现找不到配置文件的情况)
//直接在test目录下执行 mocha mocha_test.js 会出现读取不到配置文件的错误

describe("test sinon func", function () {
	context("normal ok", function () {
		it("test ok", function (done) {
			myFunc.test(0, function (err, val) {
				console.log(arguments);
				val.should.equal("test ok");
				return done();
			});
		});
	});

	context("normal err", function () {
		it("test err", function (done) {
			myFunc.test(1, function (err) {
				console.log(arguments);
				err.should.equal("test err");
				return done();
			});
		});
	});

	context("sinon normal ok", function () {
		before(function () {
			console.log("sinon normal before ok");
			mySinon.stopStub();
			mySinon.startStub();
		});
		after(function () {
			console.log("sinon normal after ok");
			mySinon.stopStub();
		});
		it("startStub ok", function (done) {
			myFunc.test(0, function (err, val) {
				console.log(arguments);
				val.should.equal("startStub ok");
				return done();
			});
		});
	});

	context("sinon normal err", function () {
		before(function () {
			console.log("sinon normal before err");
			mySinon.stopStub();
			mySinon.startStub();
		});
		after(function () {
			console.log("sinon normal after err");
			mySinon.stopStub();
		});
		it("startStub err", function (done) {
			myFunc.test(1, function (err) {
				console.log(arguments);
				err.should.equal("startStub err");
				return done();
			});
		});
	});

	context("sinon always ok", function () {
		before(function () {
			console.log("sinon always ok before");
			mySinon.stopStub();
			mySinon.okStub();
		});
		after(function () {
			console.log("sinon always ok after");
			mySinon.stopStub();
		});
		it("okStub", function (done) {
			myFunc.test(1, function (err, val) {
				console.log(arguments);
				val.should.equal("okStub");
				return done();
			});
		});
	});

	context("sinon always err", function () {
		before(function () {
			console.log("sinon always err before");
			mySinon.stopStub();
			mySinon.errStub();
		});
		after(function () {
			console.log("sinon always err after");
			mySinon.stopStub();
		});
		it("errStub", function (done) {
			myFunc.test(0, function (err, val) {
				console.log(arguments);
				err.should.equal("errStub");
				return done();
			});
		});
	});
});


