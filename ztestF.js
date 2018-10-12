let requestStory_2_12_0 = {
	"defaultNextStory": -1,
	"bgChgColor": "#FFFFFFFF",
	"conditionLibrary": {
		"conditions": [
			{
				"leftValue": {"gDataIndex": 16},
				"rightValue": {"type": "FixedValue", "fixedValue": 1},
				"compareType": "BiggerAndEqual"
			},
			{
				"index": 1,
				"leftValue": {"gDataIndex": 17},
				"rightValue": {"type": "FixedValue", "fixedValue": 1},
				"compareType": "BiggerAndEqual"
			},
			{
				"index": 2,
				"leftValue": {"gDataIndex": 19},
				"rightValue": {"type": "FixedValue", "fixedValue": 1},
				"compareType": "BiggerAndEqual"
			},
			{
				"index": 3,
				"leftValue": {"gDataIndex": 18},
				"rightValue": {"type": "FixedValue", "fixedValue": 1},
				"compareType": "BiggerAndEqual"
			}
		]
	},
	"switchStoryList": [
		{"nextStory": 1},
		{"conditionId": 1, "nextStory": 2},
		{"conditionId": 2, "nextStory": 3},
		{"conditionId": 3, "nextStory": 4}
	],
	"noPlayFragment": true,
	"bgMusicId": -1,
	"bgMusicCmd": "PlayImmediate",
	"soundEffectId": -1,
	"cvTalkTimeScale": 1,
	"progress": 0.0060606059
};