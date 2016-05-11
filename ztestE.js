/**
 * Created by wyq on 2016/5/10.
 */
var ztest = require("./ztestD.js");

var funList = [];
for (var i = 0; i < 10; ++i) {
	funList.push(new ztest(i));
}

funList.forEach(fun => {
	fun.start();
});