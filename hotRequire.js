/**
 * Created by wyq on 2015/11/23.
 */
var hotrequire = require("hotrequire");

var mTest;
var testHotrequire = function () {
	var path = "../../hotrequire1.js";

	if (!mTest) {
		mTest = hotrequire(path, function (newModel) {
			console.log("*******hotrequire********");
			mTest = newModel;
		});
	}
	mTest.test();
};

setInterval(testHotrequire, 1000);
