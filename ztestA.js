const moment = require("moment");
let item = {
	"_id": "594b78d82ebb822d6e7034fb",
	"typeDesc": "notification of entering the fence",
	"users": "5909a7e08fc0634c63459139",
	"sn": "01581117C6E54A93",
	"deviceName": "NJ",
	"type": 0,
	"content": "Your device NJ(01581117C6E54A93) enters the fence range you have set on 2017-06-22 15:59:20.",
	"createdTime": 1498118360760,
	"emails": ["54wvqso@163.com"],
	"lonlat": [116.4813007638, 39.9958292599],
	"indexTags": ["NJ", "01581117C6E54A93", "54wvqso@163.com", "notification of entering the fence"],
	"id": "594b78d82ebb822d6e7034fb",
	"deviceInfo": {
		"sn": "01581117C6E54A93",
		"updatedTime": 1498203973490,
		"deviceName": "NJ",
		"sensorData": {"battery": 82},
		"tags": [],
		"_alarmSwitch": false
	}
};
item.deviceInfo && item.deviceInfo.updatedTime && (item.devices.updatedTime = moment(+item.devices.updatedTime).format('YYYY-MM-DD HH:mm:ss'));
console.log(item);