let city_es_mapping = {
	"mappings": {
		"logs": {
			"properties": {
				"msgId": {"type": "string", "index": "not_analyzed"},
				"taskId": {"type": "string", "index": "not_analyzed"},
				"sn": {"type": "string", "index": "not_analyzed"},
				"type": {"type": "string", "index": "not_analyzed"},
				"appId": {"type": "string", "index": "not_analyzed"},
				"lonlat": {"type": "geo_point"},
				"updatedTime": {"type": "date"},
				"interval": {"type": "short"},
				"sensorData": {
					"type": "object",
					"properties": {
						"battery": {"type": "float"},
						"temperature": {"type": "float"},
						"light": {"type": "float"},
						"humidity": {"type": "float"},
						"water": {"type": "float"},
						"jinggai": {"type": "float"},
						"drop": {"type": "float"},
						"co": {"type": "float"},
						"co2": {"type": "float"},
						"distance": {"type": "float"},
						"calibration": {"type": "float"},
						"angle": {"type": "float"},
						"so2": {"type": "float"},
						"no2": {"type": "float"},
						"ch4": {"type": "float"},
						"pm2_5": {"type": "float"},
						"pm10": {"type": "float"},
						"cover": {"type": "boolean"},
						"level": {"type": "boolean"},
						"smoke": {"type": "boolean"},
						"customer": {"type": "string", "index": "not_analyzed"}
					}
				}
			},
			"_ttl": {
				"enabled": true,
				"default": "100s"
			}
		}
	}
};

let addTtl = {
	"_ttl": {
		"enabled": true,
		"default": "100s"
	}
};