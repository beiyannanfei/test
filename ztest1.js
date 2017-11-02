let a = {
	"_id": "59f7f68057299c1ccd7a181e",
	"owners": "507f1f77bcf86cd799100000",
	"deviceSN": "01531117C602099A",
	"appId": "50I35FhvOAw9",
	"sensorType": "flame",
	"unionType": "flame",
	"deviceType": "flame",
	"sensorData": {"battery": 100, "interval": 10, "flame": true},
	"rules": [
		{
			"_id": "59f7f68057299c1ccd7a181a",
			"sensorTypes": "flame",
			"thresholds": 0,
			"conditionType": "gt"
		}
	],
	"records": [
		{
			"type": "sendSMS",
			"sid": "13983652948",
			"phoneList": [
				{
					"name": "Limjoe",
					"number": "18600866484"
				},
				{
					"receiveTime": "2017-03-02+15:40:00",
					"error_msg": "DELIVRD",
					"reciveStatus": 1,
					"name": "18600866585",
					"number": "18600866585"
				}
			],
			"updatedTime": "2017-10-31T04:05:20.429Z"
		},
		{
			"type": "alarm",
			"sensorType": "flame",
			"thresholds": true,
			"updatedTime": "2017-10-31T04:05:20.429Z"
		}
	],
	"__v": 0,
	"updatedTime": 1509422720429,
	"isDeleted": false,
	"displayStatus": 0,
	"id": "59f7f68057299c1ccd7a181e",
	"_updatedTime": "2017-10-31 12:05:20"
};