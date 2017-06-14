var a =
{
	"gb": {
		"mappings": {
			"tweet": {
				"properties": {
					"date": {
						"type": "date"
					},
					"bool": {
						"type": "boolean"
					},
					"num_float": {
						"type": "float"
					},
					"num_double": {
						"type": "double"
					},
					"num_byte": {
						"type": "byte"
					},
					"num_short": {
						"type": "short"
					},
					"num_interger": {
						"type": "integer"
					},
					"num_long": {
						"type": "long"
					},
					"str_analyzed": {
						"type": "string",
						"index": "analyzed"
					},
					"str_not_analyzed": {
						"type": "string",
						"index": "not_analyzed"
					},
					"str_no": {
						"type": "string",
						"index": "no"
					},
					"obj": {
						"type": "object",
						"properties": {
							"obj_1": {
								"type": "long"
							}
						}
					},
					"lonlat": {
						"type": "geo_point"
					}
				}
			}
		}
	}
}