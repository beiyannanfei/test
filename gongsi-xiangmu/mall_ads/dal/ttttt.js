/**
 * Created by luosm on 2015/8/4.
 */
/**
 * Created by wyq on 2015/7/30.
 */

var redis = require('redis');

var redisClient = redis.createClient(6379, '10.148.68.31');

var doc ="{\"type\":1,\"tvmId\":\"15810866728\",\"yyyappId\":\"wx33dc1a5264b4e846\",\"send_name\":\"\xe7\x8e\x96\xe6\x98\x9f\xe6\x97\x85\xe8\xa1\x8c\xe6\x95\x91\xe6\x8f\xb4\",\"key\":\"55c076fa6156f4fe59aba026\",\"createTime\":\"2015-08-05 21:47:53\",\"start\":1438782473058,\"length\":\"100000\",\"end\":1438782573058,\"winCount\":101,\"money\":{\"average\":\"0.15\",\"max\":\"2000\",\"send_name\":\"\xe5\xa4\xa9\xe8\x84\x89\xe8\x81\x9a\xe6\xba\x90\",\"info\":[{\"rate\":1,\"name\":\"\xe7\xba\xa2\xe5\x8c\x851\",\"percent\":50,\"count\":1,\"type\":\"c\",\"moneyType\":\"p\",\"oType\":{\"type\":\"p\",\"name\":\"%\"},\"redMax\":\"1000\",\"newCount\":1,\"total\":87.15,\"userMoney\":87.15},{\"rate\":2,\"name\":\"\xe7\xba\xa2\xe5\x8c\x852\",\"percent\":50,\"count\":100,\"type\":\"p\",\"moneyType\":\"p\",\"oType\":{\"type\":\"p\",\"name\":\"%\"},\"redMax\":\"1\",\"newCount\":87,\"total\":87.15,\"newTotal\":87,\"userMoney\":1}],\"prizes\":[{\"rate\":\"3\",\"count\":\"100000\",\"name\":\"\xe7\x8e\x96\xe6\x98\x9f\xe6\x95\x91\xe6\x8f\xb4\xe7\x89\xb9\xe6\x83\xa0\",\"wx_red_proty\":{\"id\":\"55a8cea0c89e0d840701155a\",\"logo_src\":\"http://mall.mtq.tvm.cn/pic/20150717175531-1404-2cbtrt.jpg\",\"award_name\":\"\xe7\x8e\x96\xe6\x98\x9f\xe6\x95\x91\xe6\x8f\xb4\xe7\x89\xb9\xe6\x83\xa0\",\"award_type\":\"\xe7\xac\xac\xe4\xb8\x89\xe6\x96\xb9\xe5\x8d\xa1\xe5\x88\xb8(URL)\",\"award_grade\":\"3\",\"total_num\":\"100000\",\"wx_red_proty\":{\"_id\":\"55a8cea0c89e0d840701155a\",\"name\":\"\xe7\x8e\x96\xe6\x98\x9f\xe6\x95\x91\xe6\x8f\xb4\xe7\x89\xb9\xe6\x83\xa0\",\"count\":846899,\"pic\":\"http://mall.mtq.tvm.cn/pic/20150717175531-1404-2cbtrt.jpg\",\"type\":3,\"link\":\"http://tv.tripota.cn/html/jiuxing1/\",\"tvmId\":\"15810866728\",\"yyyappId\":\"wx33dc1a5264b4e846\",\"dateTime\":\"2015-07-17T09:45:04.243Z\",\"visible\":false,\"award_grade\":\"3\",\"total_num\":\"100000\"}},\"id\":\"55a8cea0c89e0d840701155a\",\"_id\":\"55a8cea0c89e0d840701155a\",\"pic\":\"http://mall.mtq.tvm.cn/pic/20150717175531-1404-2cbtrt.jpg\",\"type\":3,\"link\":\"http://tv.tripota.cn/html/jiuxing1/\",\"tvmId\":\"15810866728\",\"yyyappId\":\"wx33dc1a5264b4e846\",\"dateTime\":\"2015-07-17T09:45:04.243Z\"}],\"total\":174.29999999999998,\"SurplusTotal\":174.29999999999998},\"allUsersLength\":1162,\"winsUsersLength\":687}";

doc = JSON.parse(doc);
console.log(doc);

redisClient.lpush("countSysLottery", JSON.stringify(doc), function (err, res) {
    console.log("*********************** err: %j, res: %j", err, res);
});


/*
 function noop(){
 console.log("*********uncaughtException************");
 }
 process.on('uncaughtException', noop);

 var doc = {
 key: '55a5d3bb6c73b05a1f2aaf49',
 allUsersLength: 20,
 createTime: new Date().toLocaleString()
 };

 function test() {
 redisClient.lpush('countSysLottery', JSON.stringify(doc), function(err, res) {
 console.log("arguments: %j", arguments);
 throw new Error();
 });
 }

 test();
 */