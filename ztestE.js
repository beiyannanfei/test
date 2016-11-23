// curl -H "x-session-id: YKljIL29Ug-bTmyL3bvSr6VkHjYsRhY5" "http://qing.mocha.server.sensoro.com/pay/wxpay/order/refund" -d "refund_fee=1&reason=abcdefg&out_trade_no=2016103117573969669935270212"

var redis = require("redis");
var rc = redis.createClient(6379, "127.0.0.1");

function test(cmd, args1, args2, arg3) {
	rc[cmd](args1, args2);
}

test("keys", "*", function (err, response) {
	console.log(arguments);
});