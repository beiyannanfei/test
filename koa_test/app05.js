/**
 * Created by wyq on 2015/9/17.
 */
var app = require("koa")();
var Router = require("koa-router");
var myRouter = new Router();
var parseXMLBody = require("koa-xml-body").default;

app.use(parseXMLBody());
app.use(require('koa-bodyparser')());
var xml2js = require("xml2js");

myRouter.get("/", function *(next) {
	//this.response.body = "Hello Koa";
	this.body = "Hello Koa aaa";
});

myRouter.post("/p", function *(next) {
	var data = this.request.body;
	console.log(data);
	data = tranJson(data);
	console.log(data);
	return this.body = buildXml({a: "hello post"});
});

function tranJson(obj) {
	var j = obj.xml;
	var tempJson = {};
	for (var index in j) {
		tempJson[index] = j[index][0];
	}
	return tempJson;
}

function buildXml(obj) {
	var builder = new xml2js.Builder({
		allowSurrogateChars: true
	});
	var xml = builder.buildObject({
		xml: obj
	});
	return xml;
}


app.use(myRouter.routes());
app.listen(3000, function () {
	console.log("server start listen port 3000...");
	var request = require('superagent');
	var sourceXml = "<xml><a>10</a><b>20</b><c>30</c><d>40</d></xml>";
	request
		.post("127.0.0.1:3000/p")
		.set('Content-Type', 'text/xml')
		.send(sourceXml)
		.end(function () {
			console.log("xhr: %j", arguments);
		});
});


