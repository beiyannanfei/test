/**
 * Created by chenjie on 2015/5/13.
 */

var express      = require('express');
var app          = express();
var middleware  = require('./middleware.js')
var mWxRed = require('./wxRed.js')
var syslottery  = require('./syslottery.js')
var createsyslottery  = require('./syslotterycreate.js')
var orders = require("./orders.js");
var mCard = require('./wxcard.js')
var mPrize = require('./prize.js')
var mWxRedLottery = require('./wxredLottery.js')
var mCrazyLottery = require('./crazylottery.js')
var mError = require('./error.js')
var orderCount = require("./orderCount.js");
var mWxShare = require("./wxShare.js");

var openController = require('./openController');
module.exports = app;

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/prize/list', openController.checkTvmId, mPrize.getPrize);

//红包js param
app.post('/hongbao/js/param', openController.getCheckUser, mWxRedLottery.midWxRedLotteryLoader(), mWxRedLottery.jsParam);
app.post('/3rd/hongbao/js/param', openController.get3rdCheckUser, mWxRedLottery.midWxRedLotteryLoader(), mWxRedLottery.jsParam);

//卡券js param
app.post('/card/jssdk/param', openController.getCheckUser, orders.midOrderLoader(), mCard.checkCardState, mCard.getCardApiTicket, mWxShare.getJsShareParam, mCard.generateCardJsParam)
//zpp
app.post('/card/js/param', openController.getCheckUser, openController.checkyyyappId, mCard.getCardApiTicket, mWxShare.getJsShareParam, mCard.generateCardJsParam)

//app.post('/card/jssdk/param', mCard.getCardApiTicket)

//卡券事件
app.post('/card/event/deal', mCard.dealWxCardEvent)

//开始抽奖
app.post('/syslottery/start', syslottery.startLottery);
//抽奖开始后接收用户信息接口 答题正确的
app.post('/syslottery/receiveuser',openController.checkUser, syslottery.acceptUsers);
//抽奖开始 接收用户 无论答题结果如何
app.post('/syslottery/receivealluser',openController.checkUser, syslottery.acceptAllUsers);
//获取某次抽奖的中奖用户列表 按奖品等级显示
app.get('/syslottery/winlist', openController.getCheckUser,  syslottery.lotteryResult);
//获取用户某次抽奖的中奖结果
app.get('/syslottery/user/result', openController.getCheckUser,  syslottery.getUserWinInfo);
//获取某次抽奖的奖品信息
app.get('/syslottery/prize/list', openController.getCheckUser,  syslottery.getLotteryPrizes);
//获取某次抽奖的奖池金额总数
app.get('/syslottery/money', openController.getCheckUser,  syslottery.getMoney);
//修改多个系统抽奖
app.post('/syslottery/update/copy', createsyslottery.updateMultiLottery);
//复制系统抽奖 传lotteryid 和 count
app.get('/syslottery/copy',createsyslottery.copyLottery)

app.get('/syslottery/:lotteryid/getbyid',createsyslottery.getOneLottery);

//如果是实物奖品 需要设置收货地址
app.post('/order/update/address', openController.checkUser, orders.setAddress);
//获取最近的100条订单信息
app.get('/lottery/rank', orders.getLotteryRank);
//获取单一用户的所有订单信息
app.get('/order/user/orders',openController.getCheckUser,middleware.midPageChecker(50),orders.getOrdersByUser);
//设置红包卡券的状态信息  未领0 已领1
app.post('/order/user/prize/state',openController.checkUser,orders.setWxInfoState);


//疯狂抽奖
app.get('/crazyLottery/prize', mCrazyLottery.getLotteryPrize);
app.post('/crazyLottery/start', mCrazyLottery.startCrazyLottery);
app.post('/crazyLottery/copy', mCrazyLottery.midCrazyLotteryLoader, mCrazyLottery.copyCrazyLottery);
app.post('/crazyLottery/update/copy', mCrazyLottery.midCrazyLotteryLoader, mCrazyLottery.changeCopyCrazyLottery);
app.post('/crazyLottery/draw', openController.checkUser, mCrazyLottery.midCrazyLotteryLoader, /*mCrazyLottery.checkLotteryUserTimes, */mCrazyLottery.drawCrazyLottery);
app.get('/crazyLottery/records', openController.getCheckUser, mCrazyLottery.getLotteryRecords);

app.get('/order/statistics', orderCount.statistics);
//根据createTime查询抽奖信息
app.post('/order/getCountInfo', orderCount.getCountInfo);
//上报领奖信息
app.post('/prize/reportinfo', openController.checkUser, mPrize.reportPrizeInfo);
//获取领奖数量
app.get('/orderCount/getprizecount', orderCount.getPrizeCount);
//获取某天top20排行榜
app.get('/order/gettoporder', orders.getTopExcel);
//获取某天top10的数据
app.get('/order/gettopdatainfo', orders.getTopDataInfo);
//汇总统计
app.get('/order/getsummaryinfo', orders.getSummaryInfo);
//所有中微信红包用户统计 次数和金额
app.get('/order/countwxredprize', orderCount.countWxredPrize);
//每天中奖次数最多的用户TOP10	（提供微信名、头像、中奖次数和中奖信息）
app.get('/order/gettop10datainfo', orders.getTop10DataInfo);
//最早参与奖   （每天早上6点开播后，第一轮参与中红包大奖的用户的微信名、头像、中奖金额）
app.get('/orderCount/getearliest', orderCount.getEarliestIn);
//最晚陪伴奖  （每天晚上近凌晨2点，伴随最后一次互动的中奖用户微信名、头像、中奖金额）
app.get('/orderCount/getlatest', orderCount.getLatestIn);



app.post('/error', mError.acceptError);  /*openController.checkUser, */
app.get('/error', mError.getError);

app.get('/auth/wxred/send', openController.getCheckUser,  mWxRed.authSendHongbao);
app.get('/wxred/send', middleware.checkAuthSign, orders.midOrderLoader(), mWxRedLottery.checkWxRedLotteryLoader('wxRedLotteryId'), mWxRed.checkExchangeLock, mWxRed.sendRedPager);
app.post('/wxred/create', openController.check3rdParam, mWxRed.createRed);
app.post('/wxred/send', openController.check3rdParam, mWxRedLottery.checkWxRedLotteryLoader('wxRedLotteryId'), mWxRed.lock('wxRedLotteryId'), mWxRed.sendRedBy3rd);

app.get('/wxred/state', mWxRedLottery.midWxRedLotteryLoader('wxRedLotteryId'), mWxRed.getWxRedState);