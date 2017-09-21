const _ = require('underscore');

var a = {
	"grantName": "fdhg",
	"grants": {
		"user": ["self", "modify", "getCharacter", "setShowAllDevice", "merchantList", "caseList", "addFence", "modifyPwd"],
		"task": ["list", "detail", "retry"],
		"station": [],
		"notification": ["create", "modify", "list", "del"],
		"grant": [],
		"deviceLog": ["list", "statistics"],
		"alarm": ["list", "download", "lastTime", "statistics"],
		"device": ["statusStatistics", "briefList", "detail", "list", "modify", "del", "interval", "threshold", "alarmRule", "calibration", "multiModify", "deploy", "syncIOT", "getSensorType", "typesStatistics", "alarmList", "batteryStatistics"],
		"monitor": []
	}
};

var business = {
	user: ["self", "modify", "getCharacter", "setShowAllDevice", "merchantList", "caseList", "addFence", "modifyPwd"],
	task: ["list", "detail", "retry"],
	station: [],
	notification: ["create", "modify", "list", "del"],
	grant: [],
	deviceLog: ["list", "statistics"],
	alarm: ["list", "download", "lastTime", "statistics"],
	device: ["statusStatistics", "briefList", "detail", "list", "modify", "del", "interval", "threshold", "alarmRule",
		"calibration", "multiModify", "deploy", "getSensorType", "typesStatistics", "alarmList", "batteryStatistics",
		"_multiOperateButton", "_multiSetInterval", "_multiSetAlarm", "_downloadDeviceList", "_uploadDevice"],
	monitor: ["_dataMode", "_mapMode", "_cardMode"],
};

console.log(_.difference(a.grants.station, business.station));
console.log(_.difference(a.grants.notification, business.notification));
console.log(_.difference(a.grants.grant, business.grant));
console.log(_.difference(a.grants.deviceLog, business.deviceLog));
console.log(_.difference(a.grants.alarm, business.alarm));
console.log(_.difference(a.grants.device, business.device));
console.log(_.difference(a.grants.monitor, business.monitor));