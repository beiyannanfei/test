var _ = require("underscore");
var rc = require("redis").createClient();
var async = require("async");

var tOpenList = [
	'orEt2t9Sq06HrYUqnlzjZ7yAe5rU',
	'orEt2t85eN1TIl-g4Ca-cB16aJUI',
	'orEt2tyNQusizE8-pE3acwao3vWw',
	'orEt2twK36BuhSTvuldm88ntBsk0',
	'orEt2t-I9TqrNXmalgiGTpWvulRM',
	'orEt2tzWyCNibUKlwGly6m_6ZD7Q',
	'orEt2t3_PDK7iA8ZHCpYCM8ak-Yg',
	'orEt2twEhE_H8BWTLRCrATaovdPk',
	'orEt2t0B8GMtwlz5qxWNrtIJtfIM',
	'orEt2t4esGcB8GsNN0R4PjdkLV5U',
	'orEt2t0fRwH8nXfGMv5bxPBkt1ek',
	'orEt2t_8opDPKH2Q89ia6v5g595o',
	'orEt2t_fQHjKpYO-456LN3ygGHDQ',
	'orEt2t3t5XnMlznPgqRYOB6XOmAw',
	'orEt2t2RrgiQy19ivRdeKInB0FR0',
	'orEt2t4OO7fzbPK5ayvupMdALZ8c',
	'orEt2t7rYUSW9HOt8UVdajPRW4W0',
	'orEt2tzEMJFdKpUQRfuBWJnq7D-A',
	'orEt2t6XN0cT77TdVnPsjAwvtrHc',
	'orEt2t3EOh9N4a4Nve0LYVGcSfuc',
	'orEt2t8TA0IB8nOFLrorAGfnsMn0',
	'orEt2t24NsJzF5Nch-rHNgXhZ6dw',
	'orEt2t2foyj4vn1LGhRw5zloLufg',
	'orEt2t8waJtrlleY5aAQD8Mcn9PI',
	'orEt2tzj10x9DRNy9WvGKVc7EkdQ',
	'orEt2tzj1nPuyQ5xClXLGd-g4BoY',
	'orEt2tzlZSWxaa9ngFNsPmWvccx0',
	'orEt2t0vsQ9wA0dVDWf0tchDGErA',
	'orEt2txZ4At1IkaKP_6XVeFIcTkQ',
	'orEt2t1-ht_SyQ0J90iqmCBEoNG8',
	'orEt2t-BSXURUkjH-DSCGq1r2UNA',
	'orEt2tzERQx30IZ1eKPxqJJUgK6s',
	'orEt2t9l3W9c52dce-5JTIauQ2h4',
	'orEt2t6C_06lmuug5uEof3TfMXiE',
	'orEt2t-bF9z6-X_49zZM-lpwWsvM',
	'orEt2t88KgTt0IBWJqPooQ-qgQXg',
	'orEt2ty-frKhlen0MLlrPUff3ky0',
	'orEt2t3JNM37e8NOsYW9GhFQVXHE',
	'orEt2t1jo3guSayCBTnr6p5FUfs0',
	'orEt2t2-W4kiyOUqZjwpdLr_pv24',
	'orEt2t8iAmAGFVBSZz5KfxFFLtZM',
	'orEt2t0Jn1T3rvwsSxg1UdPbwVmY',
	'orEt2t4i51K5NVf1eN90zdRb7_YM',
	'orEt2t5kiAXSvoysmAJ46J_1ILDo',
	'orEt2t5gJjiAFwS9A0az2gZ8rvvo',
	'orEt2t3Ups_dViwntqoBgQDLbC94'
];

async.eachSeries(tOpenList, function (tOpenId, cb) {
	rc.HSET("tOpenId_tvmName_mobile_nickName_relation", tOpenId, JSON.stringify({tvmName: "本地测试", mobile: "18810776836", nickName: "北艳难菲"}), function () {
		return cb(null);
	});
}, function (err) {
	console.log("=======finish");
});