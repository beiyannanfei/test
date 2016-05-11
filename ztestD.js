/**
 * Created by wyq on 2016/5/10.
 */

function test(name) {
	this.name = name;
}

test.prototype.start = function () {
	var name = this.name;
	console.log("========= name: %j", name);
};

module.exports = test;