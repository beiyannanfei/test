/**
 * Created by wyq on 2015/10/15.
 */
var kafka = require("kafka-node");

var Producer = kafka.Producer;
var KeyedMessage = kafka.KeyedMessage;
var client = new kafka.Client("10.247.36.21:2181");
var producer = new Producer(client);
var km = new KeyedMessage('key', 'message');
var payloads = [
    {topic: 'topic1', messages: 'hi', partition: 0},
    {topic: 'topic2', messages: ['hello', 'world', km]}
];
producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
        console.log(data);
    });
});

producer.on('error', function (err) {
});





