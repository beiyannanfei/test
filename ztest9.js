var xml2js = require('xml2js');
exports.json2xml = function (obj) {
	var builder = new xml2js.Builder({
		allowSurrogateChars: true
	});
	var xml = builder.buildObject({
		xml: obj
	});
	return xml;
};

console.log(exports.json2xml({a:10}));