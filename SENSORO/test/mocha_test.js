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
});


