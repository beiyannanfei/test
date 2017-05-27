// const rc = require("./ztestF").createRedisClient();
const rc = require("./ztestF")();

rc.keys("*", function () {
	console.log(arguments);
});