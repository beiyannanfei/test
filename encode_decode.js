var a = {
	openId: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
	channelId: "1782AAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
}

var b = JSON.stringify(a);
var c = new Buffer(b).toString('base64');
console.log("encode: %j", c);

var d = c;
var e = new Buffer(d, 'base64').toString('utf8');
var f = JSON.parse(e);
console.log("decode: %j", f);

/*function decode(string) {
 var body = new Buffer(string, 'base64').toString('utf8');
 return JSON.parse(body);
 }
 function encode(body) {
 body = JSON.stringify(body);
 return new Buffer(body).toString('base64');
 }*/

var punycode = require('punycode');
console.log("b = " + b);
console.log("punycode.encode = " + punycode.encode(b));

