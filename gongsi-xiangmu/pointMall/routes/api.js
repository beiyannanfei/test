var express      = require('express');
var app          = express();
var mGoods       = require('./goods.js');
var mActivity    = require('./activity.js');
var mLottery     = require('./lottery.js');
var prizePool    = require('./prizePool');
var mLotteryEvent     = require('./lotteryEvent.js');
var mKuaidi      = require('./kuaidiApi.js');
var mWxShare      = require('./wxShare');
var mAddress     = require('./address.js');
var routes     = require('./index.js');
var mFile      = require('./file.js');
var mExcel      = require('./excel.js');
var path         = require('path');
var middleware = require('./middleware');
var mLotteryStatistics = require('./lotteryStatistics');
var mAccount = require('./account')
var mRedPager = require('./redpager')
var mGv = require('./gv')
var mUser = require('./user')
var videoPlayer = require('./videoPlayer');

var integral = require('./integral');
var search = require('./search');
var personal = require('./personal');
var behavior = require('./behavior');
var qrcode = require('./qrcode');
var groups = require('./groups');
var userGroup= require('./userGroup');
var statistics = require('./statistics');
var mStore = require('./store');
var wxPay = require('./wxPay');
var mRedPagerEvent = require('./redPagerEvent');
var searchStatistics = require('./searchStatistics');
var thirdController = require('./3rdController');
var sms = require('./sms');
var mallCard = require('./mallCard');
//var mall = require('./mall');

var openApi = require('./openApi');

module.exports = app;

var config = require('../config.js');
var NODE_ENV = config.NODE_ENV;

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'temp')));
app.set('views', path.join(__dirname, '..', 'views'));

app.use('/open', openApi);

//set Integral unit
app.use(middleware.getIntegralUnit);

//login
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);
app.get('/home', routes.home);

app.get('/', routes.authTokenBySession, routes.authSuccess);
app.get('/goods/manage', routes.authTokenBySession, routes.authGoodsSuccess);
app.get('/lottery/manage', routes.authTokenBySession, routes.authLotterySuccess);
app.get('/order/manage', routes.authTokenBySession, routes.authOrderSuccess);
app.get('/lottery/statistics', routes.authTokenBySession, routes.authLotteryStatisticsSuccess);
app.get('/lottery/activity', routes.authTokenBySession, routes.authActivitySuccess);
app.get('/auth/pmall/manage', routes.authTokenBySession, routes.authStoreSuccess);
app.get('/auth/redPager/manage', routes.authTokenBySession, routes.authRedPagerSuccess);

//prize
app.get('/prize', routes.midAuth(false), mGoods.gotoPrize);
app.get('/add/prize', routes.midAuth(false), mGoods.gotoAddPrize);
app.get('/prize/:id/update', routes.midAuth(false), mGoods.midGoodsLoader(), mGoods.gotoPrizeUpdate);
app.post('/prize/:id/update', routes.midAuth(), mGoods.midGoodsLoader(), mGoods.updateGoods);
app.delete('/goods/:id', routes.midAuth(false), mGoods.midGoodsLoader(), mGoods.delGoods);

//goods
app.get('/goods', routes.midAuth(false), mGoods.gotoGoods);
app.get('/list/goods', routes.midAuth(false), mGoods.listGoods);
app.get('/add/goods', routes.midAuth(false), mGoods.gotoAddGoods);
app.post('/add/goods', routes.midAuth(false), mGoods.addGoods);
app.get('/goods/:id/update', routes.midAuth(false), mGoods.midGoodsLoader(), mGoods.gotoGoodsUpdate);
app.post('/goods/:id/update', routes.midAuth(), mGoods.midGoodsLoader(), mGoods.updateGoods);
app.get('/goods/category', routes.midAuth(false), mGoods.getGoodsCategory);
app.get('/goods/:id/info', routes.midAuth(false), mGoods.midGoodsLoader(), mGoods.goodsInfo);
app.post('/goods/state/:state', routes.midAuth(false), mGoods.updateGoodsState);
app.get('/list/buy/goods', routes.midAuth(false), mGoods.listBuyGoods);
app.get('/redPager/prize', routes.midAuth(), mGoods.listRedPager);
app.get('/export/goods/statistics', routes.midAuth(), mGoods.exportGoods);
app.post('/goods/gain/info', routes.midAuth(false), routes.midAuthUser(false), mGoods.loadGoodsGainInfo);
app.get('/vip/demand/select/list', routes.midAuth(), mGoods.listDemandVipGoods);

app.get('/wmh/video/resource', routes.midAuth(), mGoods.getWmhVideoRes);
app.get('/wmh/video/json', mGoods.getWmhVideoResJSON);
app.get('/video/goods', routes.midAuth(), mGoods.listVideoGoods);
app.get('/goto/video/goods/player/:id', routes.midAuth(), routes.midAuthUser(true), mGoods.midGoodsLoader(), videoPlayer.gotoVideoPlayer);
app.get('/goods/:id/video/res', routes.midAuth(), routes.midAuthUser(false), mGoods.midGoodsLoader(), videoPlayer.getGoodsVideoRes);
app.post('/add/player/history', routes.midAuth(), routes.midAuthUser(false), videoPlayer.addPlayerHistory);
app.post('/remove/player/history', routes.midAuth(), routes.midAuthUser(false), videoPlayer.delPlayerHistory);
app.get('/player/history', routes.midAuth(), routes.midAuthUser(false), videoPlayer.playerHistory);
app.get('/goto/player/history', routes.midAuth(), routes.midAuthUser(false), videoPlayer.gotoPlayerHistory);
app.post('/video/player/sign', routes.midAuth(), routes.midAuthUser(false), videoPlayer.videoSign);

//activity
app.get('/activity', routes.midAuth(false), mActivity.gotoActivity);
app.get('/add/activity', routes.midAuth(false), mActivity.gotoAddActivity);
app.post('/add/activity', routes.midAuth(false), mActivity.checkFile, mActivity.addActivity);
app.get('/activity/:id', routes.midAuth(false), mActivity.midActivityLoader, mActivity.getActivity);
app.get('/activity/:id/update', routes.midAuth(false), mActivity.midActivityLoader, mActivity.gotoUpdateActivity);
app.post('/activity/:id/update', routes.midAuth(), mActivity.midActivityLoader, mActivity.checkFile, mActivity.activityUpdate);
app.get('/activity/:id/goods', routes.midAuth(false), mActivity.midActivityLoader, mActivity.getGoods);
app.delete('/activity/:id', routes.midAuth(false), mActivity.midActivityLoader, mActivity.delActivity);
app.get('/lottery/enable/goods', routes.midAuth(false), mGoods.listLotteryGoods);
app.get('/3rd/activity', mActivity.thirdActivityList);

app.get('/raise/goods/:id/progress', routes.midAuth(false), routes.midAuthUser(false), mGoods.midGoodsLoader(), mGoods.getRaiseGoodsProgress);
app.get('/3rd/raise/goods/:id/progress', thirdController.check3rdGoodsParam, mGoods.midGoodsLoader(), mGoods.getRaiseGoodsProgress);

//for lottery
app.get('/lottery/rule', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), mLottery.authLotteryRule);
app.get('/redirect/lottery/bound', routes.midAuth(false), routes.midAuthUser(), mLottery.goLotteryRule);
app.get('/lottery/entry/activity/:id', middleware.checkAuthAndRedirect('Activity', 'id'), routes.midAuth(false), routes.midAuthUser(false), routes.checkUserIsFollow, mActivity.midActivityLoader, middleware.checkIsAliLottery, mLottery.gotoLottery);
app.get('/lottery/activity/:id', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), mActivity.midActivityLoader, middleware.checkIsAliLottery, mLottery.authLottery);
app.get('/lottery/activity/:id/draw', routes.midAuth(false), routes.midAuthUser(), mActivity.midActivityLoader, middleware.checkLotteryEnable, mLottery.checkUserIntegral, prizePool.checkUserLotteryTimes, mActivity.checkActivityEnableTime, mLottery.draw);
app.get('/3rd/lottery/record', mLottery.thirdLotteryRecord);
app.post('/3rd/lottery/add/times', prizePool.addUserLotteryTimes);
app.get('/lottery/add/black/list', prizePool.setBlackUser);
app.post('/3rd/lottery/draw', thirdController.check3rdSig, thirdController.check3rdLotteryParam, mActivity.midActivityLoader, middleware.checkLotteryEnable, mLottery.checkUserIntegral, prizePool.checkUserLotteryTimes, mLottery.draw);
app.get('/3rd/lottery/record/list', thirdController.checkLotteryRecordParam, middleware.midPageChecker(20), mLottery.listLottery);

app.get('/lottery/goods', routes.midAuth(false), mGoods.getGoods);
app.get('/list/lottery/event', routes.midAuth(false), middleware.midPageChecker(30), mLotteryEvent.listLotteryEvent);
app.get('/lottery/event', routes.midAuth(false), mLotteryEvent.gotoLotteryEvent);
app.get('/lottery/event/:id', routes.midAuth(false), mLotteryEvent.midEventLoader, mLotteryEvent.getEvent);
app.get('/add/lottery/event', routes.midAuth(false), mLotteryEvent.gotoAddLotteryEvent);
app.get('/update/lottery/event/:id', routes.midAuth(false), mLotteryEvent.midEventLoader, mLotteryEvent.gotoUpdateLotteryEvent);
app.post('/lottery/event', routes.midAuth(false), mLotteryEvent.addLotteryEvent);
app.post('/lottery/event/:id', routes.midAuth(false), mLotteryEvent.midEventLoader, mLotteryEvent.updateEvent);

app.get('/lottery/event/:id/detail', routes.midAuth(false), mLotteryEvent.midEventLoader, mLotteryEvent.gotoLotteryEventDetail);
app.delete('/lotteryEvent/:id', routes.midAuth(false), mLotteryEvent.midEventLoader, mLotteryEvent.delEvent);
app.post('/lottery/event/:id/goods/:goodsId', routes.midAuth(false), mLotteryEvent.midEventLoader, mGoods.midGoodsLoader('goodsId'), mLotteryEvent.startLottery);
app.post('/lottery/event/:id/goods/:goodsId/done', routes.midAuth(false), mLotteryEvent.midEventLoader, mGoods.midGoodsLoader('goodsId'), mLotteryEvent.lotteryDone);
app.post('/lottery/event/:id/goods/:goodsId/send/message', routes.midAuth(false), mLotteryEvent.midEventLoader, mGoods.midGoodsLoader('goodsId'), mLotteryEvent.sendMessage);
app.post('/lottery/event/:id/send/message', routes.midAuth(false), mLotteryEvent.midEventLoader, mLotteryEvent.sendEventMessage);
app.get('/lottery/event/:id/goods/:goodsId', routes.midAuth(false), mLotteryEvent.midEventLoader, mGoods.midGoodsLoader('goodsId'), mLotteryEvent.gotoLotteryEventMembers);
app.get('/lotteryEvent/:id/bound/list', mLotteryEvent.midEventLoader, mLotteryEvent.gotoLotteryEventBound);
app.get('/lotteryEvent/:id/bound/user/list', mLotteryEvent.midEventLoader, mLotteryEvent.getLotteryEventBoundList);
app.get('/search/user', routes.midAuth(false), mLotteryEvent.searchUser);

app.get('/order/list', routes.midAuth(false), mLottery.gotoOrderList);
app.get('/lottery/list', routes.midAuth(false), middleware.midPageChecker(20), mLottery.listLottery);
app.get('/lottery/list/rank', routes.midAuth(false), routes.midAuthUser(false), middleware.midPageChecker(20), mLottery.midRankLoader, mLottery.listLottery);
app.get('/export/lottery/list', routes.midAuth(false), mLottery.exportOrder);
app.post('/order/:id', routes.midAuth(), mLottery.midLotteryLoader, mLottery.updateOrder);
app.post('/order/:id/:state', routes.midAuth(), mLottery.midLotteryLoader, mLottery.lotteryDeal);
app.post('/order/:state/send/message', routes.midAuth(), mLottery.lotterySendMessage);
app.delete('/order/:id', routes.midAuth(false), mLottery.delOrder);
app.get('/check/user/new/order', routes.midAuth(false), routes.midAuthUser(false), mLottery.checkUserUnCompleteOrder);
//app.get('/goto/order/:id/detail', routes.midAuth(false), mLottery.midLotteryLoader, mLottery.gotoOrderDetail);
//app.get('/order/:id/detail', routes.midAuth(false), mLottery.midLotteryLoader, mLottery.orderDetail);

//for account
app.get('/auth/me/order/list', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), mAccount.gotoMyOrderList);
app.get('/me/account', routes.midAuth(), routes.midAuthUser(false), mAccount.gotoMyAccount);
app.get('/me/order/list', routes.midAuth(false), routes.midAuthUser(false), middleware.midPageChecker(20), mLottery.listLottery);
app.get('/go/me/order/list', routes.midAuth(false), routes.midAuthUser(false), mLottery.gotoMeOrderList);
app.get('/me/order/:id/detail', routes.midAuth(false), routes.midAuthUser(false), mLottery.midLotteryLoader, mLottery.gotoMeOrderDetail);
app.get('/go/me/red/pager/list', routes.midAuth(false), routes.midAuthUser(false), mRedPager.gotoMeRedPagerList);
app.get('/me/red/pager/list', routes.midAuth(false), routes.midAuthUser(false), mRedPager.meRedPagerList);

app.get('/me/enable/mallCard/list', routes.midAuth(), routes.midAuthUser(), mallCard.listEnableCard);

//lottery statistics
app.get('/lottery/statistics/index', routes.midAuth(), mLotteryStatistics.home);
app.get('/lottery/statistics/result', routes.midAuth(), mLotteryStatistics.getStatistics);
app.get('/lottery/statistics/detail', routes.midAuth(), mLotteryStatistics.detail);
app.get('/lottery/statistics/prize/detail', routes.midAuth(), mLotteryStatistics.prizeDetail);

app.post('/store/share/:id', routes.midAuth(), routes.midAuthUser(false), mStore.midStoreLoader, mWxShare.getJsShareParam, mWxShare.getStoreShareParam);
app.get('/enter/store/:id', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), mStore.midStoreLoader, mStore.authStore);
app.get('/inter/store/:id', middleware.checkAuthAndRedirect('Store', 'id'), routes.midAuth(), routes.midAuthUser(false), mStore.midStoreLoader, mStore.gotoStore);
app.get('/goods/detail', middleware.checkAuthAndRedirect('Goods', 'id'), routes.midAuth(), routes.midAuthUser(), routes.checkUserIsFollow, mGoods.midGoodsLoader(), middleware.checkLimitCountToBuy, mStore.gotoGoodsDetail);
//for 3rd
app.get('/auth/goods/:id', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), middleware.third, mStore.authGoods);
app.post('/goods/share/:id', routes.midAuth(), routes.midAuthUser(false), mGoods.midGoodsLoader(), mWxShare.getJsShareParam, mWxShare.getGoodsShareParam);

app.post('/lottery/:id/exchange/goods/:goodsId', routes.midAuth(false), routes.midAuthUser(false), middleware.checkExchangeLock('goodsId'), mLottery.midLotteryLoader, mGoods.midGoodsLoader('goodsId'), mLottery.doExchange);
app.get('/goto/exchange/goods/:id', routes.midAuth(), routes.midAuthUser(false), mGoods.midGoodsLoader(), mStore.gotoExchange);
app.post('/exchange/goods/:id', routes.midAuth(), routes.midAuthUser(), middleware.checkExchangeLock(), mGoods.midGoodsLoader(), middleware.checkLimitCount, mStore.checkExchangeUserIntegral, mStore.doExchange);
app.get('/exchange/goods/:id/success', routes.midAuth(), routes.midAuthUser(false), mGoods.midGoodsLoader(), mStore.gotoExchangeSuccess);
app.get('/store', routes.midAuth(), mStore.gotoStoreList);
app.get('/store/list', routes.midAuth(), mStore.storeList);
app.get('/store/add', routes.midAuth(), mStore.gotoAddStore);
app.get('/store/:id/update', routes.midAuth(), mStore.midStoreLoader, mStore.gotoUpdateStore);
app.get('/store/:id', routes.midAuth(), mStore.midStoreLoader, mStore.getStore);
app.delete('/store/:id', routes.midAuth(), mStore.midStoreLoader, mStore.delStore);
app.post('/add/store', routes.midAuth(false), mStore.addStore);
app.post('/store/:id/update', routes.midAuth(false), mStore.updateStore);
app.get('/store/select/list', routes.midAuth(), mStore.selectStoreList);

app.post('/goods/:id/wxpay/order', routes.midAuth(), routes.midAuthUser(), middleware.getIp, middleware.checkExchangeLock(), mGoods.midGoodsLoader(), middleware.checkLimitCount, mStore.checkUserIntegral, mallCard.midMallCardCheck, wxPay.goPay)
app.get('/goods/wxpay', routes.midAuth(), routes.midAuthUser(), mGoods.midGoodsLoader(), mStore.getInter, mStore.gotoSubmitOrder)
app.get('/goods/:id/submit/order', routes.midAuth(), routes.midAuthUser(false), mGoods.midGoodsLoader(), mStore.goodsOrder)
app.get('/pay/goods/:id/success', routes.midAuth(), routes.midAuthUser(false), mGoods.midGoodsLoader(), mStore.gotoPaySuccess);
app.post('/wxpay/result', wxPay.payResult)
app.get('/wxpay/order', routes.midAuth(), routes.midAuthUser(), wxPay.orderState)
app.post('/wxpay/cancel/order', routes.midAuth(), routes.midAuthUser(), wxPay.cancelPay)
app.get('/wxpay/address/param', routes.midAuth(), routes.midAuthUser(), wxPay.addressParam)
app.get('/wxpay/verify/goods', mLottery.verifyUserGoods)
app.get('/wxpay/goods/buyer', mLottery.listUser)
app.post('/verify/demand/goods', routes.midAuth(), routes.midAuthUser(true), mLottery.verifyVideoGoods)
app.post('/wxpay/warning', wxPay.warning)

app.get('/red/pager', routes.midAuth(), mRedPagerEvent.gotoRedpagerList);
app.get('/add/redPager/event', routes.midAuth(), mRedPagerEvent.gotoAddRedPager);
app.get('/redPager/event/:id/update', routes.midAuth(), mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.gotoUpdateRedPager);
app.post('/add/redPager/event', routes.midAuth(), mRedPagerEvent.addRedPager);
app.post('/redPager/event/:id/update', routes.midAuth(), mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.updateRedPager);
app.get('/redPager/:id/info', routes.midAuth(), mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.getRedPagerEventInfo);
app.delete('/redPagerEvent/:id', routes.midAuth(false), mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.delRedPagerEvent);
app.get('/redPager/event/:id/statistics', routes.midAuth(), mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.gotoRedPagerStatistics);

app.get('/enter/redPager/:id', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.enterRedPager);
app.get('/inner/redPager/:id', routes.midAuth(), routes.midAuthUser(), mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.redPagerResult);
app.get('/redPagerEvent/:id/result', routes.midAuth(), routes.midAuthUser(), routes.checkUserIsFollow, mRedPagerEvent.checkUserFollowed, mRedPagerEvent.midRedPagerLoader, middleware.checkRedPagerEnable, mRedPagerEvent.checkUserRedPagerTimes, mRedPagerEvent.drawRedPager);
app.get('/redPagerEvent/:id/bound/list', routes.midAuth(), routes.midAuthUser(), mRedPagerEvent.midRedPagerLoader, middleware.midPageChecker(10), mRedPagerEvent.loadBoundList);
app.get('/me/enable/redPager/list', routes.midAuth(), routes.midAuthUser(), mRedPagerEvent.listEnableRedPager);
app.post('/verify/cash/redPager/psw', routes.midAuth(), mRedPagerEvent.verifyPassword);

//kuai di query
app.get('/kuaidi/info', mKuaidi.query);

//address manage
app.get('/address/list', routes.midAuth(), routes.midAuthUser(), mAddress.gotoAddress);
app.get('/address', routes.midAuth(), routes.midAuthUser(), mAddress.query);
app.post('/address', routes.midAuth(), routes.midAuthUser(), mAddress.addAddress);
app.get('/address/default', routes.midAuth(), routes.midAuthUser(), mAddress.queryDefault);
app.post('/address/default', routes.midAuth(), routes.midAuthUser(), mAddress.setDefault);
app.post('/address/:addressId/update', routes.midAuth(), routes.midAuthUser(), mAddress.midAddressLoader, mAddress.updateAddress);
app.post('/address/:addressId/delete', routes.midAuth(), routes.midAuthUser(), mAddress.midAddressLoader, mAddress.deleteAddress);

//
app.get('/address/write', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), mAddress.authOrderId, mAddress.write);
app.post('/address/reselect',routes.midAuth(),  mAddress.reselect);
app.get('/address/getAddress', mAddress.getAddress);
app.get('/address/lists', mAddress.list);

//for file
app.get('/i/:fileId', mFile.getFile);
app.post('/image/upload', mFile.postFile);
app.post('/excel/upload', mExcel.postFile);

//bind mobile
app.get('/gv', routes.midAuth(), routes.midAuthUser(), mGv.generate)
app.get('/bind/mobile', routes.midAuth(), routes.midAuthUser(), mUser.gotoBindMobile)
app.post('/bind/mobile', routes.midAuth(), routes.midAuthUser(), mUser.bindMobile)
app.post('/verify/code', routes.midAuth(), routes.midAuthUser(), mUser.verifyGvCode)
app.get('/user/bind/mobile', routes.midAuth(), routes.midAuthUser(true), mUser.getUserMobile)

app.post('/video/player/share/:id', routes.midAuth(), routes.midAuthUser(), mWxShare.getJsShareParam, mGoods.midGoodsLoader(), mWxShare.getVideoShareParam)

//query integral
app.get('/search/query',search.queryIndex);
//query integralLog
app.get('/search/integralLog',search.integralLogIndex);

//search Keyword
app.get('/search/keyword',search.keyword);
app.get('/search/statistics',searchStatistics.index);


// queryUserName
app.get('/integral/queryUserName',routes.midAuth(),integral.queryUserName);
//index
app.get('/integral/index',routes.authTokenBySession,integral.index);
app.get('/integral/integral',routes.midAuth(),integral.index);
//add
app.post('/integral/add', integral.addIndex);
//Minus
app.post('/integral/minus',integral.minusIndex);

app.post('/point/minus',middleware.integralAuthSign,integral.minusIndex);
app.post('/point/add',middleware.integralAuthSign,integral.addIndex);

// integralAction
app.post('/integral/action',routes.midAuth(), integral.integralAction);
// integralDetails
app.get('/integral/details',routes.midAuth(),integral.integralDetails);
//integralHistory
app.get('/integral/history',routes.midAuth(),integral.history);
//top
app.get('/integral/top',routes.midAuth(),integral.top);
//filter
app.get('/integral/filter',routes.midAuth(),integral.filter);


//personal
app.get('/personal/index', middleware.checkAuthSign, routes.authToken('wxToken'),routes.midAuthOpenId('openid'), personal.index);
//queryUser
if (NODE_ENV != 'ali'){
    app.get('/personal/queryUser',personal.queryUser);
}
app.get('/personal/reacquire',personal.reacquireUser);
app.get('/personal/deploy',routes.authTokenBySession,personal.deploy);
app.post('/personal/add',routes.midAuth(),personal.add);
app.get('/personal/unit',personal.unit);

//behavior
app.get('/behavior/index',routes.authTokenBySession,behavior.index);
app.get('/behavior/query', routes.midAuth(),behavior.query);
app.get('/behavior/find',behavior.find);
app.get('/behavior/statistics/index', routes.authTokenBySession,behavior.statisticsIndex);
app.get('/behavior/statistics', routes.midAuth(),behavior.statistics);
app.post('/behavior/add', behavior.add);
app.get('/behavior/groups', behavior.groups);

//groups
app.post('/groups/add',routes.midAuth(),groups.add);
app.get('/groups/query',routes.midAuth(),groups.query);
app.get('/groups/index',routes.authTokenBySession,groups.index);
app.get('/groups/packet',routes.midAuth(),groups.index);
app.get('/groups/groups',routes.midAuth(),groups.groups);
app.get('/groups/queryUser',routes.midAuth(),groups.queryUser);
app.post('/groups/update',routes.midAuth(),groups.groupAction);
app.post('/groups/action',routes.midAuth(),groups.action);
app.get('/groups/chat',routes.midAuth(),groups.Chat);
app.get('/groups/groupChat',routes.midAuth(),groups.groupChat);
app.get('/groups/queryGroupUser',routes.midAuth(),groups.queryGroupUser);
app.post('/groups/graphic',routes.midAuth(),groups.graphic);

//userGroup
app.post('/userGroup/add',userGroup.add);
app.get('/userGroup/query',userGroup.query);

app.post('/group/user/add',userGroup.groupAuthSign,userGroup.add);
//app.get('/group/user/query',userGroup.query);

//qrcode
app.post('/qrcode/index',qrcode.index);

//url statistics
app.get('/url/statistics', statistics.getUrl);

//mall
//app.get('/mall/register', mall.register);
//
//SMS
app.get('/sms/verification', sms.verificationCode);
app.post('/sms/send',sms.smsAuthSign,sms.sendSMS);


//app.get('/openApi/redPagerEvent/:id/result', routes.midOpenApiAuth, routes.midAuthUser(true), routes.checkUserIsFollow, mRedPagerEvent.checkUserFollowed, mRedPagerEvent.midRedPagerLoader, middleware.checkRedPagerEnable, mRedPagerEvent.checkUserRedPagerTimes, mRedPagerEvent.drawRedPager);