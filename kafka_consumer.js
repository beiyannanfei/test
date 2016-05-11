/**
 * Created by wyq on 2015/10/16.
 */

'use strict';

var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.Client;
//var argv = require('optimist').argv;
var topic = "wyq_test";

var client = new Client('115.159.123.178:2181');
var topics = [
        {topic: "wyq_test", partition: 0}
    ],
    options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024*1024, encoding: 'utf8'};

var consumer = new Consumer(client, topics, options);
var offset = new Offset(client);

consumer.on('message', function (message) {
    console.log("******************%j", message);
});

consumer.on('error', function (err) {
    console.log('error', err);
});

/*
 * If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
 */
consumer.on('offsetOutOfRange', function (topic) {
    topic.maxNum = 2;
    offset.fetch([topic], function (err, offsets) {
        var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
        consumer.setOffset(topic.topic, topic.partition, min);
    });
});