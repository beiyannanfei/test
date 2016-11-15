var express = require("../../express_3.X/node_modules/express");
var app = express();

app.use(express.bodyParser({    //如果不加这句代码，那么post中的body参数无法解析
	maxFieldsSize: 1024 * 1024
}));

//curl "127.0.0.1:5000/test"
app.get("/test", function (req, res) {  //ab -c 100 -n 10000 "127.0.0.1:5000/test"
	console.log("get /test param: %j", req.query);
	return res.send("get test");
});

app.post("/test/p", function (req, res) {
	console.log("post /test/p body: %j", req.body);
	return res.send("post test/p");
});

exports.server = require('http').createServer(app);
exports.server.listen(5000, function () {
	console.log("server start port 5000...");
});