var a = {
	"query": {
		"filtered": {
			"filter": {
				"range": {
					"age": {"gt": 30}
				}
			},
			"query": {
				"match": {
					"last_name": "smith"
				}
			}
		}
	}
};