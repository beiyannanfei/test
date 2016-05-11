var app = require('express')()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server);

server.listen(80);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/client/index.html');
});

io.sockets.on('connection', function (socket) {
	var index = 0;
	socket.emit('news', { hello: 'world' + index++ });
	socket.on('my other event', function (data) {
		console.log(data);
		//socket.emit('news', { hello: 'world' + index++});
	});
});