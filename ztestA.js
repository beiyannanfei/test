var a = "a|b|c|d";
var b = "{\"a\":10,\"b\":20}";

try {
	var c = JSON.parse(a);
	console.log("c = %j", c);
} catch (e) {
	console.log("e = %j", e.message);
	var d = JSON.parse(b);
	console.log("d = %j", d);
}



