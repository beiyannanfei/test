/**
 * Created by wyq on 2016/3/21.
 */

var restify = require('restify');

function respond(req, res, next) {
	res.send('hello ' + req.params.name);
}

var server = restify.createServer();
server.get('/hello/:name', respond);

server.listen(8080, function() {
	console.log('%s listening at %s', server.name, server.url);
});

//curl -is http://localhost:8080/hello/roy
