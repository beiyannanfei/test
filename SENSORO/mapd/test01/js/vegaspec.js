/**
 * Created by wyq on 17/9/1.
 */
const exampleVega = {
	"width": 384,
	"height": 564,
	"data": [
		{
			"name": "tweets",
			"sql": "SELECT goog_x as x, goog_y as y, tweets_data_table.rowid FROM tweets_data_table"
		}
	],
	"scales": [
		{
			"name": "x",
			"type": "linear",
			"domain": [
				-3650484.1235206556,
				7413325.514451755
			],
			"range": "width"
		},
		{
			"name": "y",
			"type": "linear",
			"domain": [
				-5778161.9183506705,
				10471808.487466192
			],
			"range": "height"
		}
	],
	"marks": [
		{
			"type": "points",
			"from": {
				"data": "tweets"
			},
			"properties": {
				"x": {
					"scale": "x",
					"field": "x"
				},
				"y": {
					"scale": "y",
					"field": "y"
				},
				"fillColor": "blue",
				"size": {
					"value": 3
				}
			}
		}
	]
};