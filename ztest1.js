var text = {
	"appId": "n7A3uIsqL58w",
	"sn": "11440117C696504A",
	"deviceType": "pm",
	"type": "text",
	"msgId": "58fe210213b51044cf8a8102",
	"data": {"interval": 60, "battery": -1, "pm10": 13, "pm2_5": 12},
	"createdTime": 1493049602528
};

var event = {
	"appId": "n7A3uIsqL58w",
	"sn": "11311017C642A4BD",
	"type": "event",
	"msgId": "58feb8b713b51044cf8ae693",
	"taskId": 10583,
	"data": {"resultCode": 1, "resultData": {}},
	"createdTime": 1493088439443
};
var _ = require("underscore");

var data = {a: 0};
var upDoc = {};
_.isUndefined(data.a) || (upDoc.sensorData.battery = data.a);
console.log(upDoc);
