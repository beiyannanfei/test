/**
 * Created by wyq on 17/8/2.
 */
var fs = require("fs");
var zlib = require('zlib');

var req = fs.createReadStream('./f4e8bc54510186743ae006042860a140.gz');
req.pipe(zlib.createGunzip())
	.pipe(fs.createWriteStream('./a.csv'));

req.on("end", function () {
	console.log("==== finid");
});

req.on("error", function () {
	console.log("==== err");
});