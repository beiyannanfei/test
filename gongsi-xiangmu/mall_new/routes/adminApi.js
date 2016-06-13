/**
 * Created by chenjie on 2015/5/12.
 */

var express      = require('express');
var appAdmin          = express();
var redisStore = require('connect-redis')(express);
var mGoods       = require('./goods.js');
var mActivity    = require('./activity.js');
var mLottery     = require('./lottery.js');
var media        = require('./media.js');
var routes     = require('./index.js');
var path         = require('path');
var middleware = require('./middleware');
var mStore = require('./store');
var mRedPagerEvent = require('./redPagerEvent');
var mCard = require('./wxcard.js');
var mCoupon = require('./coupon.js');
var mAdminController = require('./adminController.js');
var mLotteryStatistics = require('./lotteryStatistics.js');

module.exports = appAdmin;

var config = require('../config.js');
var NODE_ENV = config.NODE_ENV;

var exphbs = require('express3-handlebars').create({ defaultLayout: config.menuHTML});
appAdmin.engine('html', exphbs.engine);

appAdmin.use(express.favicon());
appAdmin.use(express.cookieParser());
appAdmin.use(express.static(path.join(__dirname, '..', 'public')));

appAdmin.use(middleware.setSession(appAdmin, redisStore, express, '/admin'));

appAdmin.use('/logout', routes.logout);
appAdmin.use('/auth', routes.auth);
appAdmin.use('/menu', routes.wmhMenu);

appAdmin.use(routes.authAdminSession);
appAdmin.use(appAdmin.router)

appAdmin.set('views', path.join(__dirname, '..', 'views', 'admin'));

//prize
appAdmin.get('/prize', mGoods.gotoPrize);
appAdmin.delete('/goods/:id', mGoods.midGoodsLoader(), mGoods.delGoods);

//goods
appAdmin.get('/goods', mGoods.gotoGoods);
appAdmin.get('/list/goods', mGoods.listGoods);
appAdmin.get('/add/goods', middleware.getIntegralUnit, middleware.midBussinessCheck, mGoods.gotoAddGoods);
appAdmin.post('/add/goods', mGoods.addGoods);
appAdmin.get('/goods/:id/update', middleware.getIntegralUnit, middleware.midBussinessCheck, mGoods.midGoodsLoader(), mGoods.gotoGoodsUpdate);
appAdmin.post('/goods/:id/update', mGoods.midGoodsLoader(), mGoods.updateGoods);
appAdmin.get('/goods/category', mGoods.getGoodsCategory);
appAdmin.get('/goods/:id/info', mGoods.midGoodsLoader(), mGoods.goodsInfo);
appAdmin.post('/goods/state/:state', mGoods.updateGoodsState);
appAdmin.get('/list/buy/goods', mGoods.listBuyGoods);
appAdmin.get('/redPager/prize', mGoods.listRedPager);
appAdmin.get('/export/goods/statistics', mGoods.exportGoods);
appAdmin.get('/vip/demand/select/list', mGoods.listDemandVipGoods);

appAdmin.get('/wmh/video/resource', mGoods.getWmhVideoRes);
appAdmin.get('/video/goods', mGoods.listVideoGoods);

//activity
appAdmin.get('/activity', middleware.getIntegralUnit, mActivity.gotoActivity);
appAdmin.get('/add/activity', middleware.getIntegralUnit, mActivity.gotoAddActivity);
appAdmin.post('/add/activity', mActivity.checkFile, mActivity.addActivity);
appAdmin.get('/activity/:id', mActivity.midActivityLoader, mActivity.getActivity);
appAdmin.get('/activity/:id/update', mActivity.midActivityLoader, mActivity.gotoUpdateActivity);
appAdmin.post('/activity/:id/update', mActivity.midActivityLoader, mActivity.checkFile, mActivity.activityUpdate);
appAdmin.delete('/activity/:id', mActivity.midActivityLoader, mActivity.delActivity);
appAdmin.get('/lottery/enable/goods', mGoods.listLotteryGoods);

appAdmin.get('/order/list', mLottery.gotoOrderList);
appAdmin.get('/lottery/list', middleware.midPageChecker(20), mLottery.listLottery);
appAdmin.get('/export/lottery/list', mLottery.exportOrder);
appAdmin.post('/order/:id', mLottery.midLotteryLoader, mLottery.updateOrder);
appAdmin.post('/order/:id/:state', mLottery.midLotteryLoader, mLottery.lotteryDeal);
appAdmin.post('/order/:state/send/message', mLottery.lotterySendMessage);
appAdmin.delete('/order/:id', mLottery.delOrder);
appAdmin.get('/goto/order/:id/detail', routes.midAuth(false), mLottery.midLotteryLoader, mLottery.gotoOrderDetail);
appAdmin.get('/order/:id/detail', routes.midAuth(false), mLottery.midLotteryLoader, mLottery.orderDetail);

appAdmin.get('/store', mStore.gotoStoreList);
appAdmin.get('/store/list', mStore.storeList);
appAdmin.get('/store/add', middleware.getIntegralUnit, mStore.gotoAddStore);
appAdmin.get('/store/:id/update', mStore.midStoreLoader, mStore.gotoUpdateStore);
appAdmin.get('/store/:id', mStore.midStoreLoader, mStore.getStore);
appAdmin.delete('/store/:id', mStore.midStoreLoader, mStore.delStore);
appAdmin.post('/add/store', mStore.addStore);
appAdmin.post('/store/:id/update', mStore.updateStore);
appAdmin.get('/store/select/list', mStore.selectStoreList);

appAdmin.get('/red/pager', mRedPagerEvent.gotoRedpagerList);
appAdmin.get('/add/redPager/event', mRedPagerEvent.gotoAddRedPager);
appAdmin.get('/redPager/event/:id/update', mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.gotoUpdateRedPager);
appAdmin.post('/add/redPager/event', mRedPagerEvent.addRedPager);
appAdmin.post('/redPager/event/:id/update', mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.updateRedPager);
appAdmin.get('/redPager/:id/info', mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.getRedPagerEventInfo);
appAdmin.delete('/redPagerEvent/:id', mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.delRedPagerEvent);
appAdmin.get('/redPager/event/:id/statistics', mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.gotoRedPagerStatistics);
appAdmin.post('/verify/cash/redPager/psw', mRedPagerEvent.verifyPassword);

appAdmin.get('/card', mCard.gotoCards);
appAdmin.get('/card/list', mCard.listCard);
appAdmin.get('/add/card', middleware.midBussinessCheck, mCard.gotoAddCards);
appAdmin.get('/update/card/:id', middleware.midBussinessCheck, mCard.gotoAddCards);
appAdmin.get('/card/info/:id', mCard.midCardLoader(), mCard.cardInfo);
appAdmin.post('/card', mCard.addCard);
appAdmin.delete('/card/:id', mCard.midCardLoader(), mCard.deleteCard);
appAdmin.post('/card/:id/update', mCard.midCardLoader(), mCard.updateCard);
appAdmin.post('/card/logo', mCard.uploadLogo);
appAdmin.get('/card/color', mCard.getColors);
appAdmin.post('/card/consume', mCard.consumeCode);
appAdmin.post('/card/white/list', mCard.setWhiteList);
appAdmin.get('/card/:id/go/receiver', mCard.midCardLoader(), mCard.goReceiver);
appAdmin.get('/card/:id/receiver', mCard.receiver);
appAdmin.get('/card/:card_id/qrcode', mCard.cardQrcode);

//lottery statistics
appAdmin.get('/lottery/statistics/index', mLotteryStatistics.home);
appAdmin.get('/lottery/statistics/result', mLotteryStatistics.getStatistics);
appAdmin.get('/lottery/statistics/detail', mLotteryStatistics.detail);
appAdmin.get('/lottery/statistics/prize/detail', mLotteryStatistics.prizeDetail);


appAdmin.get('/goto/iframe', mAdminController.enterIframe);

//coupon
appAdmin.get('/coupon/list', middleware.midSend(), middleware.midPageChecker(20), mCoupon.list);
appAdmin.post('/coupon/create', middleware.midSend(), mCoupon.create);
appAdmin.post('/coupon/disable/:id', middleware.midSend(), mCoupon.disable);
appAdmin.get("/coupon/getusedlist", middleware.midSend(), mCoupon.getUsedCoupon);
appAdmin.get('/coupon/:id/detail', middleware.midSend(), mCoupon.midCouponLoader(), mCoupon.detail)

