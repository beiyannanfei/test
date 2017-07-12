var res = {
	"errcode": 0,
	"data": [
		{
			"owners": "507f1f77bcf86cd799100001",
			"sn": "10800117C6E0A396",
			"updatedTime": 1482209318431,
			"appId": "appId123890",
			"name": "温湿度",
			"createTime": 1481089781668,
			"alarmsRecords": [{
				"sensorTypes": "temperature",
				"alarmStatus": 2,
				"_id": "5965d159de4029faf12d55c1"
			}, {"sensorTypes": "humidity", "alarmStatus": 2, "_id": "5965d159de4029faf12d55c0"}],
			"alarmStatus": 2,
			"status": 2,
			"alarms": {
				"createTime": "2017-07-12T07:35:53.370Z",
				"notification": {"content": "test2@test.com", "types": "email"},
				"rules": [{
					"conditionType": "gt",
					"thresholds": 40,
					"sensorTypes": "temperature",
					"_id": "5965d159de4029faf12d55c3"
				}, {"conditionType": "gt", "thresholds": 90, "sensorTypes": "humidity", "_id": "5965d159de4029faf12d55c2"}]
			},
			"lonlat": [116.4910506602, 40.0144949565],
			"tags": ["tag1", "tag2"],
			"sensorData": {"humidity": 23.89, "temperature": 24.99, "battery": 76},
			"deviceType": "temp_humi",
			"sensorTypes": ["temperature", "humidity"],
			"_level": 2,
			"level_display": "失联/24.99°C,23.89%",
			"alarms_display": "温度大于40°C, 湿度大于90%",
			"sensoroDetails": {
				"humidity": {"value": 23.89, "unit": "%"},
				"temperature": {"value": 24.99, "unit": "°C"},
				"battery": {"value": 76, "unit": "%"}
			},
			"_updatedTime": "2016-12-20 12:48:38"
		},
		{
			"sn": "10320117D5A034EC",
			"appId": "appId123890",
			"name": "DEMO设备",
			"owners": "507f1f77bcf86cd799100002",
			"updatedTime": 1471937884044,
			"createTime": 1499844953386,
			"alarmsRecords": [],
			"alarmStatus": 1,
			"status": 2,
			"alarms": {
				"createTime": "2017-04-20T03:06:25.456Z",
				"notification": {"types": "phone"},
				"rules": [{
					"_id": "58ff01c2c6fd82781724f88e",
					"conditionType": "gt",
					"thresholds": 0.1,
					"sensorTypes": "distance"
				}]
			},
			"lonlat": [119.481918, 40.003284],
			"tags": ["operator1"],
			"sensorData": {"battery": 90},
			"deviceType": "demo",
			"sensorTypes": ["roll", "pitch", "yaw", "collision"],
			"_level": 2,
			"level_display": "失联/-,-,-,无碰撞",
			"alarms_display": "水位大于 10cm",
			"sensoroDetails": {"battery": {"value": 90, "unit": "%"}},
			"_updatedTime": "2016-08-23 15:38:04"
		},
		{
			"sn": "10320117D5A024EC",
			"appId": "appId123890",
			"name": "DEMO设备",
			"owners": "507f1f77bcf86cd799100002",
			"updatedTime": 1471937884044,
			"createTime": 1499844953380,
			"alarmsRecords": [],
			"alarmStatus": 1,
			"status": 2,
			"alarms": {
				"createTime": "2017-04-20T03:06:25.456Z",
				"notification": {"types": "phone"},
				"rules": [{
					"_id": "58ff01c2c6fd82781724f88e",
					"conditionType": "gt",
					"thresholds": 0.1,
					"sensorTypes": "distance"
				}]
			},
			"lonlat": [119.481918, 40.003284],
			"tags": ["operator1"],
			"sensorData": {"battery": 90},
			"deviceType": "demo",
			"sensorTypes": ["smoke"],
			"_level": 2,
			"level_display": "失联/无烟",
			"alarms_display": "水位大于 10cm",
			"sensoroDetails": {"battery": {"value": 90, "unit": "%"}},
			"_updatedTime": "2016-08-23 15:38:04"
		},
		{
			"sn": "10320117D5A024EA",
			"appId": "appId123890",
			"name": "新型井盖",
			"owners": "507f1f77bcf86cd799100002",
			"updatedTime": 1471937884044,
			"createTime": 1499844953379,
			"alarmsRecords": [],
			"alarmStatus": 1,
			"status": 2,
			"alarms": {
				"createTime": "2017-04-10T11:55:21.147Z",
				"notification": {"types": "phone"},
				"rules": [{"thresholds": 0, "sensorTypes": "cover", "_id": "5965d159de4029faf12d55cf"}, {
					"thresholds": 0,
					"conditionType": "gt",
					"sensorTypes": "level",
					"_id": "5965d159de4029faf12d55ce"
				}]
			},
			"lonlat": [119.481918, 40.003284],
			"tags": ["operator1"],
			"sensorData": {"battery": 90},
			"deviceType": "cover",
			"sensorTypes": [],
			"_level": 2,
			"level_display": "失联/",
			"alarms_display": "水位溢出",
			"sensoroDetails": {"battery": {"value": 90, "unit": "%"}},
			"_updatedTime": "2016-08-23 15:38:04"
		},
		{
			"sn": "10320117D5A024E9",
			"appId": "appId123890",
			"name": "商户测试设备",
			"owners": "507f1f77bcf86cd799100002",
			"updatedTime": 1471937884044,
			"createTime": 1499844953377,
			"alarmsRecords": [],
			"alarmStatus": 1,
			"status": 2,
			"alarms": {
				"createTime": "2017-07-12T07:35:53.377Z",
				"notification": {"content": "18600001234", "types": "phone"},
				"rules": [{"conditionType": "gt", "thresholds": 1000, "sensorTypes": "no2", "_id": "5965d159de4029faf12d55cc"}]
			},
			"lonlat": [119.481918, 40.003284],
			"tags": ["operator1"],
			"sensorData": {"battery": 90, "no2": 16, "customer": "8"},
			"deviceType": "module",
			"sensorTypes": ["gps"],
			"_level": 2,
			"level_display": "失联/-",
			"alarms_display": "二氧化氮大于 1881800ug/m3",
			"sensoroDetails": {"battery": {"value": 90, "unit": "%"}, "no2": {"value": "30109", "unit": "ug/m3"}},
			"_updatedTime": "2016-08-23 15:38:04"
		},
		{
			"sn": "10320117C5A024E9",
			"appId": "appId123890",
			"name": "商户测试设备",
			"owners": "507f1f77bcf86cd799100002",
			"updatedTime": 1471937884044,
			"createTime": 1499844953372,
			"alarmsRecords": [],
			"alarmStatus": 1,
			"status": 2,
			"alarms": {
				"createTime": "2017-07-12T07:35:53.372Z",
				"notification": {"content": "18600001234", "types": "phone"},
				"rules": [{"conditionType": "gt", "thresholds": 1000, "sensorTypes": "no2", "_id": "5965d159de4029faf12d55c5"}]
			},
			"lonlat": [119.481918, 40.003284],
			"tags": ["operator1"],
			"sensorData": {"battery": 90, "no2": 16, "customer": "8"},
			"deviceType": "module",
			"sensorTypes": ["no2"],
			"_level": 2,
			"level_display": "失联/30109ug/m3",
			"alarms_display": "二氧化氮大于 1881800ug/m3",
			"sensoroDetails": {"battery": {"value": 90, "unit": "%"}, "no2": {"value": "30109", "unit": "ug/m3"}},
			"_updatedTime": "2016-08-23 15:38:04"
		}
	]
};

