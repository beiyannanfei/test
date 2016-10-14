/**
 * Created by sensoro on 16/8/12.
 */

// sudo npm i -g mocha@2.5.3

var assert = require("assert");
describe('Array', function(){
	describe('#indexOf()', function(){
		it('should return -1 when the value is not present', function(){
			assert.equal(-1, [1,2,3].indexOf(5));
			assert.equal(-1, [1,2,3].indexOf(0));
		})
	});
	describe("#indexOf_1()", function () {
		it("should return 0 when the value is in array", function () {
			assert.equal(0, [1,2,3].indexOf(1));
		});
	});
	describe("skip test", function () {
		it.skip("skip results should return 0 when the value is in array", function () {
			assert.equal(-1, [1,2,3].indexOf(1));
		});
	});
});

describe("");
