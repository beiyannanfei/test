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
var mStore = require('./store.js');

module.exports = app;

/*app.use(middleware.midSend())*/

//lottery
app.get('/lottery/record/list', openController.checkToken, openController.checkLotteryRecordParam, middleware.midPageChecker(20), mLottery.listLottery);
app.post('/lottery/draw', openController.checkToken, openController.checkOpenId, openController.loadUser, mActivity.midActivityLoader, middleware.checkLotteryEnable, mLottery.checkUserIntegral, prizePool.checkUserLotteryTimes, mActivity.checkActivityEnableTime, mLottery.draw); //openController.check3rdSig,

//activity
app.get('/list/activity', openController.checkToken, mActivity.thirdActivityList);
app.get('/activity/time/prize', mActivity.midActivityLoader, mActivity.findActivityTimeAndPrize);

app.post('/lottery/exchange/goods', openController.checkToken, openController.checkOpenId, middleware.checkExchangeLock('goodsId'), mLottery.midLotteryLoader, mGoods.midGoodsLoader('goodsId'), mAddress.fillAddress, mLottery.doExchange);

app.post('/exchange/goods/:id', openController.checkToken, openController.checkOpenId, middleware.checkExchangeLock(), openController.loadUser, mGoods.midGoodsLoader(), middleware.checkLimitCount, mStore.checkExchangeUserIntegral, mStore.doExchange);
