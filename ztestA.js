let a = {
	"state": "open",
	"settings": {
		"index": {
			"creation_date": "1499142698168",
			"uuid": "tBYn_d2HT5KUEvneGmZcSw",
			"number_of_replicas": "1",
			"number_of_shards": "3",
			"version": {
				"created": "2030299"
			}
		}
	},
	"mappings": {
		"logs": {
			"_ttl": {
				"enabled": true,
				"default": 34560000000
			},
			"properties": {
				"taskId": {
					"index": "not_analyzed",
					"type": "string"
				},
				"sn": {
					"index": "not_analyzed",
					"type": "string"
				},
				"appId": {
					"index": "not_analyzed",
					"type": "string"
				},
				"lonlat": {
					"type": "geo_point"
				},
				"interval": {
					"type": "short"
				},
				"sensorData": {
					"properties": {
						"water": {
							"type": "float"
						},
						"so2": {
							"type": "float"
						},
						"drop": {
							"type": "float"
						},
						"co2": {
							"type": "float"
						},
						"pm2_5": {
							"type": "float"
						},
						"calibration": {
							"type": "float"
						},
						"customer": {
							"index": "not_analyzed",
							"type": "string"
						},
						"jinggai": {
							"type": "boolean"
						},
						"smoke": {
							"type": "boolean"
						},
						"angle": {
							"type": "float"
						},
						"temperature": {
							"type": "float"
						},
						"ch4": {
							"type": "float"
						},
						"yaw": {
							"type": "float"
						},
						"roll": {
							"type": "float"
						},
						"co": {
							"type": "float"
						},
						"cover": {
							"type": "boolean"
						},
						"distance": {
							"type": "float"
						},
						"level": {
							"type": "boolean"
						},
						"humidity": {
							"type": "float"
						},
						"no2": {
							"type": "float"
						},
						"battery": {
							"type": "float"
						},
						"pm10": {
							"type": "float"
						},
						"pitch": {
							"type": "float"
						},
						"light": {
							"type": "float"
						},
						"collision": {
							"type": "boolean"
						}
					}
				},
				"msgId": {
					"index": "not_analyzed",
					"type": "string"
				},
				"type": {
					"index": "not_analyzed",
					"type": "string"
				},
				"updatedTime": {
					"format": "strict_date_optional_time||epoch_millis",
					"type": "date"
				}
			}
		}
	},
	"aliases": []
};