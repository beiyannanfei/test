/**
 * Created by wyq on 17/9/15.
 */
var localtunnel = require('localtunnel');

var tunnel = localtunnel(3000, {subdomain: "userName"}, function (err, tunnel) {
	if (!!err) {
		return console.log("err: %j", err.message || err);
	}
	console.log("url: %j", tunnel.url);       //这个url就是代理的本地3000端口
	return console.log("tunnel: %j", tunnel);
});

tunnel.on('close', function () {
	return console.log("close: %j", arguments);
});