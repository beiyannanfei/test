/**
 * Created by wyq on 2015/10/16.
 */
var kafka = require('kafka-node');
var Producer = kafka.Producer;
var KeyedMessage = kafka.KeyedMessage;
var Client = kafka.Client;
var client = new Client('115.159.123.178:2181');
var producer = new Producer(client, { requireAcks: 1 });
var topic = process.argv[2] || "wyq_test";
console.log("********* send topic: %j", topic);

var index = 0;
producer.on('ready', function () {
    var message = 'AAAAAAAAA_';
    var keyedMessage = new KeyedMessage('keyed', 'a keyed message');

    producer.createTopics([topic], false, function (err, data) {
        console.log("***** createTopic: %j, err: %j, data: %j", topic, err, data);
        setInterval(function () {
            sendTopic(message + index);
        }, 5000);

    });
});

var sendTopic = function (msg) {
    producer.send([
        { topic: topic, partition: 0, messages: msg, attributes: 0 }
    ], function (err, result) {
        console.log("**************** err: %j, result: %j", err, result);
        index = ++result[topic]["0"];
    });
};

producer.on('error', function (err) {
    console.log('error', err)
});