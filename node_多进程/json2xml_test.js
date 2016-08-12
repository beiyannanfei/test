/**
 * Created by sensoro on 16/8/12.
 */

var xml2js = require('xml2js');

function buildXml(obj) {
	var builder = new xml2js.Builder({
		allowSurrogateChars: true
	});
	var xml = builder.buildObject({
		xml:obj
	});
	return xml;
}

console.log(buildXml({a:10}));
