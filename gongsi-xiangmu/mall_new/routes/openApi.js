/**
 * Created by chenjie on 2015/5/13.
 */

var express      = require('express');
var app          = express();

var mLottery     = require('./lottery.js');
var middleware = require('./middleware');
var prizePool    = require('./prizePool');
var openController = require('./openController');
var mActivity    = require('./activity.js');
var mGoods = require('./goods.js');
var mAddress = require('./address.js');
var media = require("./media.js");
var mRedPagerEvent = require('./redPagerEvent');
var mCoupon = require('./coupon.js');
var mError = require('./error.js');

module.exports = app;

app.use(middleware.midSend())

//lottery
app.post('/lottery/add/times', prizePool.addUserLotteryTimes);
app.post('/lottery/draw', openController.checkToken, openController.checkOpenId, openController.loadUser, mActivity.midActivityLoader, middleware.checkLotteryEnable, mLottery.checkUserIntegral, prizePool.checkUserLotteryTimes, mLottery.draw);
app.get('/lottery/record/list', openController.checkToken, openController.checkLotteryRecordParam, middleware.midPageChecker(20), mLottery.listLottery);

//activity
app.get('/list/activity', openController.checkToken, mActivity.thirdActivityList);

//coupon
app.post('/coupon/receive/:id', middleware.checkSign, middleware.lock('coupon', 'openId'), openController.loadUserData, mCoupon.midCouponLoader(), mCoupon.receive)
app.get('/coupon/enable/list', middleware.checkSign, openController.checkTokenAndOpenId, mCoupon.loadUserEnableCoupon)
app.post('/coupon/consume', middleware.checkSign, openController.checkTokenAndOpenId, mCoupon.consumeCouponBy3rd)
app.post('/coupon/price', middleware.checkSign, mCoupon.getCouponValue);
app.get('/coupon/:id/detail', mCoupon.midCouponLoader(), mCoupon.detail)

//用户信息
app.get('/user/info', openController.loadUserData, function(req, res){
    res.send(req.user)
})

//error
app.get('/error', mError.getError);