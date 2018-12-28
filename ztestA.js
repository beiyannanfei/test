let request = "{\"accessTokenExpiration\":2634130,\"accessTokenValue\":\"2.00yywymCKQ7_HC575c56e6b7dakEUD\",\"openId\":\"2556056204\",\"vendor\":\"weibo\",\"platform\":\"android\",\"coupon\":\"\",\"payTokenExpiration\":0,\"payTokenValue\":\"\",\"pf\":\"\",\"pfKey\":\"\",\"Extra\":{\"ClientVersion\":\"1.3.22199\",\"CpuHardware\":\"ARMv7 VFPv3 NEON;2106;10\",\"Density\":480.0,\"DeviceId\":\"cba8244dca5c1a8a7011c26b5c0a2af0\",\"GLRender\":\"OpenGLES3\",\"GLVersion\":\"OpenGL ES 3.2 v1.r12p0-04rel0.2034b5b303dca12c48abf5518afe7d96\",\"LoginChannel\":0,\"Memory\":3751,\"Network\":\"WIFI\",\"PlatID\":1,\"RegChannel\":0,\"ScreenWidth\":1080,\"ScreenHight\":1920,\"SystemHardware\":\"Meitu MP1603\",\"SystemSoftware\":\"Android OS 7.1.1 / API-25 (NMF26O/1534823061)\",\"TelecomOper\":\"中国移动\",\"vClientIP\":\"10.1.16.62\"},\"nickName\":\"杨晓兔兔\",\"icon\":\"http://tvax2.sinaimg.cn/crop.0.0.1125.1125.1024/985a528cly8fu6odgvdbsj20v90v9jv1.jpg\",\"unionid\":\"\",\"refreshTokenValue\":\"\"}";
console.log("%j", JSON.parse(request));

let a = {
	token: "abcdefg",
	doAuthRequest: {
		"accessTokenExpiration": 2634130,
		"accessTokenValue": "2.00yywymCKQ7_HC575c56e6b7dakEUD",
		"openId": "2556056204",
		"vendor": "weibo",
		"platform": "android",
		"coupon": "",
		"payTokenExpiration": 0,
		"payTokenValue": "",
		"pf": "",
		"pfKey": "",
		"Extra": {
			"ClientVersion": "1.3.22199",
			"CpuHardware": "ARMv7 VFPv3 NEON;2106;10",
			"Density": 480,
			"DeviceId": "cba8244dca5c1a8a7011c26b5c0a2af0",
			"GLRender": "OpenGLES3",
			"GLVersion": "OpenGL ES 3.2 v1.r12p0-04rel0.2034b5b303dca12c48abf5518afe7d96",
			"LoginChannel": 0,
			"Memory": 3751,
			"Network": "WIFI",
			"PlatID": 1,
			"RegChannel": 0,
			"ScreenWidth": 1080,
			"ScreenHight": 1920,
			"SystemHardware": "Meitu MP1603",
			"SystemSoftware": "Android OS 7.1.1 / API-25 (NMF26O/1534823061)",
			"TelecomOper": "中国移动",
			"vClientIP": "10.1.16.62"
		},
		"nickName": "杨晓兔兔",
		"icon": "http://tvax2.sinaimg.cn/crop.0.0.1125.1125.1024/985a528cly8fu6odgvdbsj20v90v9jv1.jpg",
		"unionid": "",
		"refreshTokenValue": ""
	}
};