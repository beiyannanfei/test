let response = "{\"code\":0,\"message\":\"Query config successfully!\",\"config\":{\"1.1.0_1.2.0\":{\"showServerList\":false,\"tags\":null,\"gConfigList\":[{\"configKey\":\"iOS审核服务器(ios-review)\",\"globalConfigVO\":{\"accountUrl\":\"https://auth-ios-review.api.worldoflove.cn\",\"announcement\":0,\"announcementUrl\":\"https://online-cdn.worldoflove.cn/announcement/\",\"avgShowTestUi\":0,\"bundleCdnUrl\":\"http://online-cdn.worldoflove.cn/ios-review/\",\"bundleCdnUrlRaw\":\"\",\"completeBundle\":-1,\"downloadUrl\":\"\",\"forbidCalendar\":1,\"forbidGather\":1,\"forbidGuide\":1,\"forbidShare\":1,\"forbidSignin\":1,\"gameServerUrl\":\"https://ios-review.gs.worldoflove.cn/\",\"gmOpen\":1,\"hashNameFLag\":1,\"prefix\":\"announcement_\",\"resVersion\":0,\"speedScaleMax\":0,\"testLoginOpen\":0,\"updateFlag\":0,\"urgentGConfigUrl\":\"http://config-beta.worldoflove.cn/global_configs/ios-review/\",\"usherOpen\":0}}]}}}";
console.log("%j", JSON.parse(response));
response = {
	"code": 0,
	"message": "Query config successfully!",
	"config": {
		"1.1.0_1.2.0": {
			"showServerList": false,
			"tags": null,
			"gConfigList": [
				{
					"configKey": "iOS审核服务器(ios-review)",
					"globalConfigVO": {
						"accountUrl": "https://auth-ios-review.api.worldoflove.cn",
						"announcement": 0,
						"announcementUrl": "https://online-cdn.worldoflove.cn/announcement/",
						"avgShowTestUi": 0,
						"bundleCdnUrl": "http://online-cdn.worldoflove.cn/ios-review/",
						"bundleCdnUrlRaw": "",
						"completeBundle": -1,
						"downloadUrl": "",
						"forbidCalendar": 1,
						"forbidGather": 1,
						"forbidGuide": 1,
						"forbidShare": 1,
						"forbidSignin": 1,
						"gameServerUrl": "https://ios-review.gs.worldoflove.cn/",
						"gmOpen": 1,
						"hashNameFLag": 1,
						"prefix": "announcement_",
						"resVersion": 0,
						"speedScaleMax": 0,
						"testLoginOpen": 0,
						"updateFlag": 0,
						"urgentGConfigUrl": "http://config-beta.worldoflove.cn/global_configs/ios-review/",
						"usherOpen": 0
					}
				}
			]
		}
	}
};