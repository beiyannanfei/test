// curl -H "x-session-id: YKljIL29Ug-bTmyL3bvSr6VkHjYsRhY5" "http://qing.mocha.server.sensoro.com/pay/wxpay/order/refund" -d "refund_fee=1&reason=abcdefg&out_trade_no=2016103117573969669935270212"

function test(flag) {
	if (flag) {
		return setTimeout(console.log, 5000, "asdfasdf");
	}
	return console.log("AAAAAAA");
}

test(true);