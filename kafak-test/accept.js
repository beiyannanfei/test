var kafka = require('kafka');

var client  = new kafka.Client({
	host:'115.159.123.178',
	port:9092,
});

client.on('message', function(topic, message, offset) {
	console.log("Consumed topic:" + topic + " message:" + message + " offset: " + offset);

});
client.on('lastmessage', function(topic, offset) {
	client.fetchTopic({name: topic, offset: offset});
});
client.connect(function() {
	client.fetchTopic({name: "userName", offset: 0});
});