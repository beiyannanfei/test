requestStory = {
	"storyId": 75,
	"defaultNextStory": -1,
	"bgChgColor": "#FFFFFFFF",
	"showText": "心平静下来，有些情感也因为放置而\n逐渐变得清晰\r",
	"chgDataList": [
		{
			"name": "原长野*10000",
			"leftValue": {"gDataIndex": 54},
			"rightValue": {"type": "FixedValue", "fixedValue": 10000},
			"chgRelation": "MultipleAssign"
		}, {
			"name": "萧川*10000",
			"leftValue": {"gDataIndex": 55},
			"rightValue": {"type": "FixedValue", "fixedValue": 10000},
			"chgRelation": "MultipleAssign"
		}, {
			"name": "江北*10000",
			"leftValue": {"gDataIndex": 56},
			"rightValue": {"type": "FixedValue", "fixedValue": 10000},
			"chgRelation": "MultipleAssign"
		}, {
			"name": "任谷*10000",
			"leftValue": {"gDataIndex": 57},
			"rightValue": {"type": "FixedValue", "fixedValue": 10000},
			"chgRelation": "MultipleAssign"
		}, {
			"name": "原长野/30",
			"leftValue": {"gDataIndex": 54},
			"rightValue": {"type": "FixedValue", "fixedValue": 40},
			"chgRelation": "DivisionAssign"
		}, {
			"name": "萧川/25",
			"leftValue": {"gDataIndex": 55},
			"rightValue": {"type": "FixedValue", "fixedValue": 25},
			"chgRelation": "DivisionAssign"
		}, {
			"name": "江北/29",
			"leftValue": {"gDataIndex": 56},
			"rightValue": {"type": "FixedValue", "fixedValue": 29},
			"chgRelation": "DivisionAssign"
		}, {
			"name": "任谷/26",
			"leftValue": {"gDataIndex": 57},
			"rightValue": {"type": "FixedValue", "fixedValue": 26},
			"chgRelation": "DivisionAssign"
		}],
	"conditionLibrary": {
		"conditions": [   //$conditionList
			{
				"leftValue": {"gDataIndex": 54},
				"rightValue": {"gDataIndex": 55},
				"compareType": "BiggerAndEqual"
			}, {
				"index": 1,
				"leftValue": {"gDataIndex": 54},
				"rightValue": {"gDataIndex": 56},
				"compareType": "BiggerAndEqual"
			}, {
				"index": 2,
				"leftValue": {"gDataIndex": 54},
				"rightValue": {"gDataIndex": 57},
				"compareType": "BiggerAndEqual"
			}, {
				"index": 3,
				"leftValue": {"gDataIndex": 55},
				"rightValue": {"gDataIndex": 54},
				"compareType": "BiggerAndEqual"
			}, {
				"index": 4,
				"leftValue": {"gDataIndex": 55},
				"rightValue": {"gDataIndex": 56},
				"compareType": "BiggerAndEqual"
			}, {
				"index": 5,
				"leftValue": {"gDataIndex": 55},
				"rightValue": {"gDataIndex": 57},
				"compareType": "BiggerAndEqual"
			}, {
				"index": 6,
				"leftValue": {"gDataIndex": 56},
				"rightValue": {"gDataIndex": 54},
				"compareType": "BiggerAndEqual"
			}, {
				"index": 7,
				"leftValue": {"gDataIndex": 56},
				"rightValue": {"gDataIndex": 55},
				"compareType": "BiggerAndEqual"
			}, {
				"index": 8,
				"leftValue": {"gDataIndex": 56},
				"rightValue": {"gDataIndex": 57},
				"compareType": "BiggerAndEqual"
			},
			{
				"index": 9,
				"type": "Group",
				"conditionIndexList": [0, 1, 2]
			},
			{
				"index": 10,
				"type": "Group",
				"conditionIndexList": [3, 4, 5]
			},
			{"index": 11, "type": "Group", "conditionIndexList": [6, 7, 8]}
		]
	},
	"switchStoryList": [
		{"conditionId": 9, "nextStory": 76},
		{"conditionId": 10, "nextStory": 77},
		{"conditionId": 11, "nextStory": 78},
		{"conditionId": -1, "nextStory": 79}
	],
	"bgMusicId": -1,
	"bgMusicCmd": "PLayFade",
	"soundEffectId": -1,
	"avgBgName": "siyin_s_029",
	"bgmName": "beauty",
	"cvTalkTimeScale": 1,
	"progress": 0.34782609
};