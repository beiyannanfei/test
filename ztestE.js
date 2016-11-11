HOST:
	测试: "http://qing.mocha.server.sensoro.com/pay"
  正式: "http://qing.sensoro.com/pay"

url: HOST + "/wxpay/order/card"     -POST      刷卡支付
所需参数:
	appid: 商户appid
	body:  商户店铺名称
	total_fee: 消费金额(整型,单位分)
	auth_code: 授权码
	shopId: 店铺id

返回值:
	错误情况:
		0. 重复请求:
				400    {errcode: 4600009, errmsg: 'operate frequently', info: '操作太频繁'}
		1. 参数错误:
				400   {errcode: 4600001, errmsg: 'params invalid', info: "详细描述"}
		2. 获取子商户号失败:
				400
					-没有配置  {errcode: 4600025, errmsg: 'sub mchId null', info: "not config sub shop info"}
					-redis故障 {errcode: 4600023, errmsg: "redis error", info: "详细描述"}
					-数据库错误 {errcode: 4600004, errmsg: "db error", info: "详细描述"}
		3. 转换openid失败:
				400  {errcode: 4600003, errmsg: "openIdQuery error", info: "详细描述"}
		4. 读取证书失败:
				400  {errcode: 4600026, errmsg: "read cert fiald", info: "详细描述"}
		5. 网络错误:
				400    {errcode: 4600005, errmsg: "net err", info: "详细描述"}
		6. 刷卡失败:
				400 {errcode: 4600003, errmsg: "postMicropay error", info: "详细描述"}

	成功:  200  {trade_state: "SUCCESS"}

  不确定状态:(出现不确定状态后需要定时请求最新状态,直到状态确定,建议每7秒一次, 查询5次)
		1.  200  {trade_state: "SYSTEMERROR", outTradeNo: "订单号"}    //微信返回系统错误
		2.  200  {trade_state: "USERPAYING", outTradeNo: "订单号"}     //用户支付中
		3.  200  {trade_state: "BANKERROR", outTradeNo: "订单号"}      //微信返回银行错误



url: HOST + "/wxpay/order/db/state"     -GET      获取订单最新状态
参数: outTradeNo
返回值:
	错误情况: 400  {errcode: 4600001, errmsg: 'params invalid', info: "outTradeNo not exists"}
								{errcode: 4600004, errmsg: 'db error', info: err.message}
								{errcode: 4600006, errmsg: 'wxpaylog null', info: 'no order'}

  正常情况: 200  {trade_state: newStatus}
	newStatus取值如下:
		1未支付 2已支付 3取消 4关闭 5退款中 6退款完成 7用户支付中 8支付失败 9网络错误 10订单撤销 11退款失败
  当newStatus==2时表示支付成功
	当newStatus==7时需要再次调用本接口继续查询
  其它情况均视为失败