let str = "{\"Extra\":{\"ClientVersion\":\"1.2.20290\",\"CpuHardware\":\"Intel(R) Core(TM) i7-4790 CPU @ 3.60GHz;3598;8\",\"Density\":96.0,\"DeviceId\":\"6f5943beedf6cc7bae03564f45294709846cd016\",\"GLRender\":\"Direct3D11\",\"GLVersion\":\"Direct3D 11.0 [level 11.1]\",\"LoginChannel\":0,\"Memory\":16321,\"Network\":\"WIFI\",\"PlatID\":2,\"RegChannel\":0,\"ScreenWidth\":720,\"ScreenHight\":1280,\"SystemHardware\":\"All Series (ASUS)\",\"SystemSoftware\":\"Windows 10  (10.0.0) 64bit\",\"TelecomOper\":\"Unity Editor\",\"vClientIP\":\"10.1.16.21\"},\"accessTokenExpiration\":1,\"accessTokenValue\":null,\"coupon\":null,\"openId\":\"18515970756\",\"payTokenExpiration\":1,\"payTokenValue\":\" \",\"pf\":\" \",\"pfKey\":\" \",\"platform\":\"desktop\",\"vendor\":\"device\"}";
// console.log(JSON.parse(str));
let json = {
	Extra:
		{
			ClientVersion: '1.2.20290',
			CpuHardware: 'Intel(R) Core(TM) i7-4790 CPU @ 3.60GHz;3598;8',
			Density: 96,
			DeviceId: '6f5943beedf6cc7bae03564f45294709846cd016',
			GLRender: 'Direct3D11',
			GLVersion: 'Direct3D 11.0 [level 11.1]',
			LoginChannel: 0,
			Memory: 16321,
			Network: 'WIFI',
			PlatID: 2,
			RegChannel: 0,
			ScreenWidth: 720,
			ScreenHight: 1280,
			SystemHardware: 'All Series (ASUS)',
			SystemSoftware: 'Windows 10  (10.0.0) 64bit',
			TelecomOper: 'Unity Editor',
			vClientIP: '10.1.16.21'
		},
	accessTokenExpiration: 1,
	accessTokenValue: null,
	coupon: null,
	openId: '18515970756',
	payTokenExpiration: 1,
	payTokenValue: ' ',
	pf: ' ',
	pfKey: ' ',
	platform: 'desktop',
	vendor: 'device'
};

let o = {
	a: "abcd",
	b: 10
};
console.log(JSON.stringify(o));