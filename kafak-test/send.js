/**
 * Created by wyq on 2016/7/15.
 */

var kafka = require('kafka');

var producer = new kafka.Producer({ host: '115.159.123.178', port: 9092 });

producer.connect().on('connect', function() {
	var topic = 'userName', message = 'Hello World 1';

	producer.send(message, topic);
	producer.close();
});
