"sn" : "01521117C69ED23E",
	"appId" : "lUn0eDNDHOMs",

{
	"_id" : ObjectId("5909a7e08fc0634c63459139"),
	"grants" : {
		"device" : [
			"get",
			"add",
			"delete",
			"update",
			"list",
			"transfer",
			"modifyCycle",
			"fence",
			"pull"
		],
		"user" : [
			"add",
			"delete",
			"update",
			"list",
			"control"
		]
	},
	"updatedTime" : ISODate("2017-05-03T09:50:24.394Z"),
	"nickname" : "nijie",
	"email" : "nijie@sensoro.com",
	"password" : "$2a$04$6R.GyzTkXzFWh3/mcBumCu12LfMsp3Op.4EOHzrKSKjC2X6x1Xk/S",
	"appId" : "lUn0eDNDHOMs",
	"appKey" : "SLR9LNalGnIXyIpjhhfTgf3uMHE5xvYaKsdQ9sAmhTZ",
	"appSecret" : "nmqI0e3c586Ywn77rzIiOMBGypl8gsC8",
	"addBy" : "58eafb50ecdead4d9075637c",
	"createdTime" : ISODate("2017-05-03T09:50:24.377Z"),
	"isDeleted" : false,
	"config" : {
		"businessCount" : 0,
		"businessLimit" : 10
	},
	"indexTags" : [
		"nijie",
		"nijie@sensoro.com",
		"vJWtoSxFnPkt"
	],
	"roles" : "dealers",
	"__v" : 0
}

{
	"sn": "01521117C69ED23E",
	"taskId": 123,
	"appSecret": "nmqI0e3c586Ywn77rzIiOMBGypl8gsC8",
	"appId": "lUn0eDNDHOMs",
	"type": "cycle",
	"content": "20",
	"status": 2,
	"createdTime": "2017-05-17T07:52:24.066Z"
}


{
	"sn" : "01581117C645CAB9",
	"deviceName" : "真实设备01581117C645CAB9",
	"deviceType" : "default",
	"appId" : "lUn0eDNDHOMs",
	"owners" : ObjectId("5909a7e08fc0634c63459139"),
	"status" : 2,
	"tags" : [
	"标签1",
	"标签2"
],
	"indexTags" : [
	"01521117C69ED23E",
	"真实设备01521117C69ED23E",
	"default",
	"标签1",
	"标签2"
],
	"sensorData" : {},
	"geofences" : [],
	"createTime" : ISODate("2017-05-17T07:52:24.066Z")
}


{
	"sn" : "01581117C645CAB9",
	"taskId" : 123,
	"appSecret" : "nmqI0e3c586Ywn77rzIiOMBGypl8gsC8",
	"appId" : "lUn0eDNDHOMs",
	"type" : "cycle",
	"content" : "20",
	"status" : 2,
	"createdTime" : "2017-05-17T07:52:24.066Z"
}

{
	"sn" : "01581117C6E54A93",
	"deviceName" : "真实设备01581117C6E54A93",
	"deviceType" : "default",
	"appId" : "lUn0eDNDHOMs",
	"owners" : ObjectId("5909a7e08fc0634c63459139"),
	"status" : 2,
	"tags" : [
	"标签1",
	"标签2"
],
	"indexTags" : [
	"01521117C69ED23E",
	"真实设备01521117C69ED23E",
	"default",
	"标签1",
	"标签2"
],
	"sensorData" : {},
	"geofences" : [],
	"createTime" : ISODate("2017-05-17T07:52:24.066Z")
}

* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
*     {
*       "errcode": 0,
*       "data": {
*         _id: '5840175bc869c181f0f3cea2',
*         email: '13888888888',
*         nickname: '路人甲',
*         sessionID: 'xxxxxxxxxxxxxxxxxx',
*         createdTime: 1471937884044
*       }
*     }