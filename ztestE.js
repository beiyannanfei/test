const request = require('superagent');
let httpPost = exports.httpPost = function (url, param, cb) {
	request.post(url)
		.type('application/x-www-form-urlencoded')
		.send(param)
		.timeout(20000)
		.accept('text/json')
		.end(function (err, xhr) {
			if (err) {
				return cb(err);
			}
			if (xhr.statusCode == 200) {
				if (xhr.text) {
					var body;
					try {
						body = JSON.parse(xhr.text);
					}
					catch (e) {
						body = xhr.text
					}
					cb(null, body);
				}
				else {
					cb('response has not content');
				}
			}
			else {
				cb(xhr.statusCode);
			}
		});
};

let localUrl = "127.0.0.1:3000/prov1/external/set/app/update";
let mochaUrl = "https://mocha-city-api.sensoro.com/prov1/external/set/app/update";
let demoUrl = "https://demo-city-api.sensoro.com/prov1/external/set/app/update";
let proUrl = "https://city-api.sensoro.com/prov1/external/set/app/update";

let iosParam = {
	types: "ios",
	version: "2.0.5",
	url: "https://itunes.apple.com/us/app/sensoro-city/id1326708946?mt=8&uo=4",
	msg: "通过 City App 查看账户下各种传感器数据的实时状况，以及预警信息。并可以通过 City App 来部署相应的传感器。"
};

let androidParam = {
	types: "android",
	version: "58",
	url: "http://fir.im/g7jk",
	msg: " "
};

httpPost(demoUrl, androidParam, function (err, response) {
	if (!!err) {
		return console.log("err: %j", err.message || err);
	}
	return console.log("response: %j", response);
});