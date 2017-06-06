var debug = require('debug')('http')
	, http = require('http')
	, name = 'My App';

// fake app

debug('booting %s', name);

http.createServer(function(req, res){
	debug(req.method + ' ' + req.url);
	res.end('hello\n');
}).listen(3000, function(){
	debug('listening');
});

require("./ztestE");

//DEBUG=http,worker node SENSORO/debug-test/ztestF.js  启动方式