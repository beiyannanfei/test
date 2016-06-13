/**
 * Created by chenjie on 2015/5/12.
 */

var path = require('path');
var express      = require('express');
var appAdmin          = express();
var redisStore = require('connect-redis')(express);
module.exports = appAdmin;

var middleware = require('./middleware.js')
var adminController = require('./adminController.js')
var mPrize = require('./prize.js')
var mCard = require('./wxcard.js')
var mWxRed = require('./wxRed.js')
var mWxRedLottery = require('./wxredLottery.js')
var routes = require('./index.js')
var createSysLottery = require("./syslotterycreate.js");
var crazyLottery = require("./crazylottery.js");
var orders = require("./orders.js");
var orderCount = require("./orderCount.js");

appAdmin.use(middleware.setSession(appAdmin, redisStore, express, '/admin'));

appAdmin.use('/menu', adminController.menu);

appAdmin.use(adminController.authAdminSession);

appAdmin.get('/page/:pageName', adminController.goAdminPage);

appAdmin.get('/prize/list', mPrize.getPrize);
appAdmin.post('/prize', mPrize.addPrize);
appAdmin.delete('/prize/:id', mPrize.delPrize);
appAdmin.get('/prize/:id/info', mPrize.midPrizeLoader(), mPrize.prizeInfo);
appAdmin.post('/prize/:id/update', mPrize.midPrizeLoader(), mPrize.updatePrize);

//card
appAdmin.get('/card/list', routes.clearToken, mCard.listCard);
appAdmin.get('/card/info/:id', routes.clearToken, mCard.midCardLoader(), mCard.cardInfo);
appAdmin.post('/card', routes.clearToken, mCard.addCard);
appAdmin.delete('/card/:id', routes.clearToken, mCard.midCardLoader(), mCard.deleteCard);
appAdmin.post('/card/:id/modifystock', routes.clearToken, mCard.midCardLoader(), mCard.modifystock);
//appAdmin.post('/card/:id/update', routes.clearToken, mCard.midCardLoader(), mCard.updateCard);
appAdmin.post('/card/logo', routes.clearToken, mCard.uploadLogo);
appAdmin.get('/card/color', routes.clearToken, mCard.getColors);
appAdmin.post('/card/consume', routes.clearToken, mCard.consumeCode);
appAdmin.post('/card/white/list', routes.clearToken, mCard.setWhiteList);
appAdmin.get('/card/:id/go/receiver', mCard.midCardLoader(), mCard.goReceiver);
appAdmin.get('/card/:card_id/qrcode', routes.clearToken, mCard.cardQrcode);
appAdmin.post('/card/:id/create/task', mCard.midCardLoader(), mCard.createTask);


//wxred pager
appAdmin.post('/wxred', mWxRed.addWxRedPrize);

//wxred lottery
//appAdmin.post('/wxredLottery', mWxRedLottery.addWxRedLottery);


//创建系统抽奖
appAdmin.post('/syslottery/create',createSysLottery.createLottery);
//修改系统抽奖
appAdmin.post('/syslottery/update',createSysLottery.updateLottery);

//根据id 获取系统抽奖详细信息
appAdmin.get('/syslottery/:lotteryid/getbyid',createSysLottery.getOneLottery);

//创建疯狂抽奖
appAdmin.post('/crazylottery',crazyLottery.addLottery);
appAdmin.get('/crazylottery/:id',crazyLottery.getLottery);
appAdmin.post('/crazylottery/:id',crazyLottery.updateLottery);

//获取订单列表
appAdmin.post('/order/list',middleware.midPageChecker(10), orders.getOrders);
//删除某个订单
appAdmin.get('/order/:id/delete', orders.delOrders);
appAdmin.post('/order/delete/ids', orders.delOrdersMulti);
//更改订单  状态 收货地址 快递信息
appAdmin.post('/order/update', orders.updateOrder);
//更改订单  状态 收货地址 快递信息
appAdmin.post('/order/update/complete', orders.updateCompleteOrder);
//导出订单
appAdmin.get('/order/update/exportorder', orders.exportorder);

//获取中奖名单时间段
appAdmin.get('/orderCount/timelist', orderCount.getTimeList);
//获取中奖名单
appAdmin.get('/orderCount/prizeList', orderCount.getPrizeList);