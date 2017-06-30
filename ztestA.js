var distance = ((self.sensorData['calibration']|| 0 ) - +self.sensorData[sensor]) * 100;
if (!self.sensorData[sensor] && self.sensorData[sensor] !== 0) {
	STATUS += '-';
} else {
	STATUS += (distance > 0 ? distance : 0).toFixed(0) + (SENSOR_CONFIG[sensor] && SENSOR_CONFIG[sensor].unit);
}

/* 1 */
{
	"_id" : ObjectId("59436d57ae9a0e43e2dbe8ad"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T04:33:37.883Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C6F7F355",
	"createTime" : ISODate("2017-06-16T05:32:07.620Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-16T05:32:07.620Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C6F7F355"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042803400038c601fa01050dbfb4bdc28202050de61119c3",
		"interval" : 600,
		"pitch" : -94.85,
		"roll" : -153.07,
		"collision" : true
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T04:33:22.887Z")
}

/* 2 */
{
	"_id" : ObjectId("594cc043208bdb0d342c4da8"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:48:57.249Z"),
	"interval" : 180,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C68F33C4",
	"createTime" : ISODate("2017-06-23T07:16:19.231Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T07:16:19.231Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	116.481209,
	39.996187
],
	"indexTags" : [
	"01601117C68F33C4"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 86,
		"customer" : "1008eccc03180032042800400038ac01fa01050df5cba9428202050dac0c21c3",
		"interval" : 180,
		"pitch" : 84.9,
		"roll" : -161.05,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"collision",
	"pitch",
	"roll"
],
	"lastUpdatedTime" : ISODate("2017-06-30T05:47:31.251Z"),
	"name" : ""
}

/* 3 */
{
	"_id" : ObjectId("594ce40d6e48222ef6c462a0"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:44:17.363Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C608DC20",
	"createTime" : ISODate("2017-06-23T09:49:01.370Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T09:49:01.370Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C608DC20"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042803400038c601fa01050d59b1b1c28202050d7df534c1",
		"interval" : 600,
		"pitch" : -88.85,
		"roll" : -11.31,
		"collision" : true
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T04:33:45.930Z")
}

/* 4 */
{
	"_id" : ObjectId("594cee0089595e37ca93fe41"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:48:57.473Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C654C8B8",
	"createTime" : ISODate("2017-06-23T10:31:28.243Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:31:28.243Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C654C8B8"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042803400038c601fa01050dcc14b5c28202050d90f2c6c2",
		"interval" : 600,
		"pitch" : -90.54,
		"roll" : -99.47,
		"collision" : true
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T05:48:23.429Z")
}

/* 5 */
{
	"_id" : ObjectId("594cee0c89595e37ca93fe52"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:43:40.049Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C65EFA41",
	"createTime" : ISODate("2017-06-23T10:31:40.322Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:31:40.321Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C65EFA41"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042800400038c601fa01050d240eb1c28202050ddc8778c2",
		"interval" : 600,
		"pitch" : -88.53,
		"roll" : -62.13,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T04:41:29.106Z")
}

/* 6 */
{
	"_id" : ObjectId("594cee1889595e37ca93fe64"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:43:31.922Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C67B6F3F",
	"createTime" : ISODate("2017-06-23T10:31:52.790Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:31:52.790Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C67B6F3F"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042800400038c601fa01050d074eb0c28202050d61bd7dc2",
		"interval" : 600,
		"pitch" : -88.15,
		"roll" : -63.43,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T04:33:41.897Z")
}

/* 7 */
{
	"_id" : ObjectId("594cee2089595e37ca93fe71"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:44:51.649Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C626CFC4",
	"createTime" : ISODate("2017-06-23T10:32:00.555Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:32:00.555Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C626CFC4"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042800400038c601fa01050d58baafc28202050dada22dc2",
		"interval" : 600,
		"pitch" : -87.86,
		"roll" : -43.41,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T05:44:41.668Z")
}

/* 8 */
{
	"_id" : ObjectId("594cee2d89595e37ca93fe8c"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:43:32.169Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C6731348",
	"createTime" : ISODate("2017-06-23T10:32:13.365Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:32:13.364Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C6731348"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042800400038c601fa01050d405cb2c28202050d2f085cc2",
		"interval" : 600,
		"pitch" : -89.18,
		"roll" : -55.01,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T04:41:17.419Z")
}

/* 9 */
{
	"_id" : ObjectId("594cee6a89595e37ca93fee3"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:44:51.056Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C6112077",
	"createTime" : ISODate("2017-06-23T10:33:14.300Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:33:14.300Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C6112077"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042800400038c601fa01050d91e9b6c28202050dcf0feac2",
		"interval" : 600,
		"pitch" : -91.46,
		"roll" : -117.03,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T05:44:45.047Z")
}

/* 10 */
{
	"_id" : ObjectId("594ceea589595e37ca93ff3f"),
	"owners" : ObjectId("590c235044aa4369905d455b"),
	"updatedTime" : ISODate("2017-06-30T10:37:43.041Z"),
	"interval" : 600,
	"appId" : "50I35FhvOAw9",
	"sn" : "01601117C6B5D33E",
	"createTime" : ISODate("2017-06-23T10:34:13.023Z"),
	"alarmsRecords" : [
	{
		"sensorTypes" : "pitch",
		"alarmStatus" : 2,
		"_id" : ObjectId("594ceea589595e37ca93ff45")
	},
	{
		"sensorTypes" : "roll",
		"alarmStatus" : 2,
		"_id" : ObjectId("594ceea589595e37ca93ff47")
	}
],
	"alarmStatus" : 2,
	"status" : 0,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:34:13.023Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : [
		{
			"conditionType" : "gt",
			"thresholds" : 8,
			"sensorTypes" : "pitch",
			"_id" : ObjectId("595629f74fd77b02d4303aeb")
		},
		{
			"conditionType" : "lt",
			"thresholds" : 2,
			"sensorTypes" : "pitch",
			"_id" : ObjectId("595629f74fd77b02d4303aea")
		},
		{
			"conditionType" : "gt",
			"thresholds" : 6,
			"sensorTypes" : "roll",
			"_id" : ObjectId("595629f74fd77b02d4303ae9")
		},
		{
			"conditionType" : "lt",
			"thresholds" : 3,
			"sensorTypes" : "roll",
			"_id" : ObjectId("595629f74fd77b02d4303ae8")
		}
	]
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C6B5D33E"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100898fc02180032042800400038c601fa01050d281838c38202050d790204c3",
		"interval" : 600,
		"pitch" : -184.09,
		"roll" : -132.01,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T10:27:32.792Z")
}

/* 11 */
{
	"_id" : ObjectId("594cef4889595e37ca940041"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T10:44:33.695Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C6916D09",
	"createTime" : ISODate("2017-06-23T10:36:56.208Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 1,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:36:56.208Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C6916D09"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 89,
		"customer" : "10089a7c180032042800400038b201fa01050db7b4b4428202050d195eb6c2",
		"interval" : 600,
		"pitch" : 90.35,
		"roll" : -91.18,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T10:34:26.358Z")
}

/* 12 */
{
	"_id" : ObjectId("594cefb989595e37ca9400f0"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:44:48.805Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C6CA373A",
	"createTime" : ISODate("2017-06-23T10:38:49.828Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:38:49.828Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"6.26",
	"01601117C6CA373A"
],
	"tags" : [
	"6.26"
],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042803400038c601fa01050d5d46b1c28202050d2100e440",
		"interval" : 600,
		"pitch" : -88.64,
		"roll" : 7.13,
		"collision" : true
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"collision",
	"pitch",
	"roll"
],
	"lastUpdatedTime" : ISODate("2017-06-30T05:44:42.819Z"),
	"name" : ""
}

/* 13 */
{
	"_id" : ObjectId("594cf05289595e37ca9401c5"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:43:30.927Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C6320FBF",
	"createTime" : ISODate("2017-06-23T10:41:22.631Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:41:22.631Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C6320FBF"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042800400038c601fa01050db817b6c28202050d0040d3c2",
		"interval" : 600,
		"pitch" : -91.05,
		"roll" : -105.63,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T04:41:32.071Z")
}

/* 14 */
{
	"_id" : ObjectId("594cf05489595e37ca9401cf"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:44:45.468Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C64CE65C",
	"createTime" : ISODate("2017-06-23T10:41:24.186Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:41:24.186Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C64CE65C"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042803400038c601fa01050d64e5b7c28202050d575500c3",
		"interval" : 600,
		"pitch" : -91.95,
		"roll" : -128.33,
		"collision" : true
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T05:44:34.409Z")
}

/* 15 */
{
	"_id" : ObjectId("594cf21b89595e37ca940466"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:43:32.883Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C6D444E2",
	"createTime" : ISODate("2017-06-23T10:48:59.128Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:48:59.128Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C6D444E2"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042800400038c601fa01050d17e2b3c28202050d3774b1c2",
		"interval" : 600,
		"pitch" : -89.94,
		"roll" : -88.73,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T04:41:23.845Z")
}

/* 16 */
{
	"_id" : ObjectId("59436e34ae9a0e43e2dbe996"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:44:45.966Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C69A61EE",
	"createTime" : ISODate("2017-06-16T05:35:48.327Z"),
	"alarmsRecords" : [
	{
		"sensorTypes" : "collision",
		"alarmStatus" : 2,
		"_id" : ObjectId("5955e51887b02e6774a1fb66")
	}
],
	"alarmStatus" : 2,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-16T05:35:48.327Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : [
		{
			"_id" : ObjectId("594cd3f36e48222ef6c44ca7"),
			"conditionType" : "gt",
			"thresholds" : 120,
			"sensorTypes" : "pitch"
		},
		{
			"_id" : ObjectId("594cd3f36e48222ef6c44ca6"),
			"conditionType" : "gt",
			"thresholds" : 0,
			"sensorTypes" : "roll"
		},
		{
			"_id" : ObjectId("594cd3f36e48222ef6c44ca5"),
			"conditionType" : "gt",
			"thresholds" : 0,
			"sensorTypes" : "collision"
		}
	]
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C69A61EE"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042803400038c601fa01050d4ffcb5c28202050d673af9c2",
		"interval" : 600,
		"pitch" : -90.99,
		"roll" : -124.61,
		"collision" : true
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T05:44:39.926Z")
}

/* 17 */
{
	"_id" : ObjectId("594cf55989595e37ca940961"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:48:47.964Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C6AFA118",
	"createTime" : ISODate("2017-06-23T11:02:49.146Z"),
	"alarmsRecords" : [
	{
		"sensorTypes" : "collision",
		"alarmStatus" : 2,
		"_id" : ObjectId("594cfad689595e37ca941275")
	},
	{
		"sensorTypes" : "pitch",
		"alarmStatus" : 2,
		"_id" : ObjectId("5954be6b87b02e67749f2609")
	}
],
	"alarmStatus" : 2,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T11:02:49.145Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : [
		{
			"conditionType" : "gt",
			"thresholds" : 45,
			"sensorTypes" : "pitch",
			"_id" : ObjectId("5955e64087b02e6774a1fe50")
		},
		{
			"conditionType" : "lt",
			"thresholds" : -45,
			"sensorTypes" : "pitch",
			"_id" : ObjectId("5955e64087b02e6774a1fe4f")
		}
	]
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C6AFA118"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 98,
		"customer" : "10180032042800400038c401fa01050d634ea6c28202050d943cd341",
		"interval" : 600,
		"pitch" : -83.15,
		"roll" : 26.4,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T05:48:25.950Z")
}

/* 18 */
{
	"_id" : ObjectId("5950b22989595e37ca9b231e"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:46:55.251Z"),
	"interval" : 60,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C61A4AB2",
	"createTime" : ISODate("2017-06-26T07:05:13.017Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-26T07:05:13.017Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C61A4AB2"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "1008a0d703180032042800400038c601fa01050d2e4aadc28202050d3f300cc2",
		"interval" : 60,
		"pitch" : -86.64,
		"roll" : -35.05,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T05:44:46.631Z")
}

/* 19 */
{
	"_id" : ObjectId("594cee8589595e37ca93ff0f"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:48:07.240Z"),
	"interval" : 60,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C671E613",
	"createTime" : ISODate("2017-06-23T10:33:41.425Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-23T10:33:41.425Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : [
		{
			"_id" : ObjectId("595336bf2bd44d02a86e5b1b"),
			"thresholds" : 0,
			"sensorTypes" : "collision"
		},
		{
			"_id" : ObjectId("595336bf2bd44d02a86e5b1a"),
			"conditionType" : "gt",
			"thresholds" : 180,
			"sensorTypes" : "pitch"
		},
		{
			"_id" : ObjectId("595336bf2bd44d02a86e5b19"),
			"conditionType" : "lt",
			"thresholds" : -180,
			"sensorTypes" : "pitch"
		},
		{
			"_id" : ObjectId("595336bf2bd44d02a86e5b18"),
			"conditionType" : "gt",
			"thresholds" : 180,
			"sensorTypes" : "roll"
		},
		{
			"_id" : ObjectId("595336bf2bd44d02a86e5b17"),
			"conditionType" : "lt",
			"thresholds" : -180,
			"sensorTypes" : "roll"
		}
	]
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C671E613"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "10180032042800400038c601fa01050daa74b7c28202050dbb7f20c2",
		"interval" : 60,
		"pitch" : -91.73,
		"roll" : -40.12,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"collision",
	"pitch",
	"roll"
],
	"lastUpdatedTime" : ISODate("2017-06-30T05:47:01.639Z"),
	"name" : ""
}

/* 20 */
{
	"_id" : ObjectId("5951cf86de9ccf6e0ac94845"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:43:35.011Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C67E63D5",
	"createTime" : ISODate("2017-06-27T03:22:46.541Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-27T03:22:46.541Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C67E63D5"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042800400038c601fa01050d58b3b2c28202050d20c69dc2",
		"interval" : 600,
		"pitch" : -89.35,
		"roll" : -78.89,
		"collision" : false
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T04:41:25.769Z")
}

/* 21 */
{
	"_id" : ObjectId("5951cfc1de9ccf6e0ac948c1"),
	"owners" : ObjectId("59522f8a2bd44d02a86cb402"),
	"updatedTime" : ISODate("2017-06-30T05:48:53.247Z"),
	"interval" : 600,
	"appId" : "mFsJkKExAuLZ",
	"sn" : "01601117C6A237AD",
	"createTime" : ISODate("2017-06-27T03:23:45.448Z"),
	"alarmsRecords" : [],
	"alarmStatus" : 1,
	"status" : 2,
	"alarms" : {
	"createTime" : ISODate("2017-06-27T03:23:45.448Z"),
		"notification" : {
		"types" : "phone"
	},
	"rules" : []
},
	"lonlat" : [
	0,
	0
],
	"indexTags" : [
	"01601117C6A237AD"
],
	"tags" : [],
	"sensorData" : {
	"battery" : 99,
		"customer" : "100800180032042803400038c601fa01050d6771b9c28202050db5e30cc3",
		"interval" : 600,
		"pitch" : -92.72,
		"roll" : -140.89,
		"collision" : true
},
	"deviceType" : "angle",
	"sensorTypes" : [
	"pitch",
	"roll",
	"collision"
],
	"lastUpdatedTime" : ISODate("2017-06-30T05:48:46.242Z")
}