/**
 * Created by wyq on 2018/9/18.
 */
const request = require('superagent');

let httpPost = exports.httpPost = function (url, param, cb) {
	request.post(url)
		.type("application/x-www-form-urlencoded")
		.send(param)
		.timeout(10000)
		.accept("text/json")
		.end(function (err, xhr) {
			if (!!err) {
				return cb(err);
			}
			if (xhr.statusCode != 200) {
				return cb(xhr.statusCode);
			}
			if (!xhr.text) {
				return cb("response has not content");
			}
			let body;
			try {
				body = JSON.parse(xhr.text);
			}
			catch (e) {
				body = xhr.text;
			}
			return cb(null, body);
		});
};

let httpGet = exports.httpGet = function (url, cb) {
	request.get(url)
		.type('application/x-www-form-urlencoded')
		.accept('text/json')
		.timeout(10000)
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

