/**
 * Created by wyq on 17/8/21.
 */
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", () => {
	console.log("connect success...");
	client.subscribe("presense-01");
	client.publish("presense-01", "hello world");
});

client.on("message", (topic, message) => {
	console.log("topic: %j", topic);
	console.log("msg: %j", message.toString());
	client.end();
});


/*
 setInterval(function () {
 client.publish("presense-01", new Date().toLocaleString());
 }, 100);*/
