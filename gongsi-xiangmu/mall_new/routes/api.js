var express      = require('express');
var app          = express();
var redisStore = require('connect-redis')(express);
var mGoods       = require('./goods.js');
var mActivity    = require('./activity.js');
var mLottery     = require('./lottery.js');
var prizePool    = require('./prizePool');
var mKuaidi      = require('./kuaidiApi.js');
var mWxShare      = require('./wxShare');
var mAddress     = require('./address.js');
var routes     = require('./index.js');
var mFile      = require('./file.js');
var path         = require('path');
var middleware = require('./middleware');
var mAccount = require('./account')
var mRedPager = require('./redpager')
var mGv = require('./gv')
var mUser = require('./user')
var videoPlayer = require('./videoPlayer');

var mStore = require('./store');
var wxPay = require('./wxPay');
var mRedPagerEvent = require('./redPagerEvent');
var sms = require('./sms');
var mCard = require('./wxcard.js');
var mallCard = require('./mallCard.js');

var media        = require('./media.js');
var mError = require('./error.js')

module.exports = app;

var exphbs = require('express3-handlebars').create({});
app.engine('html', exphbs.engine);

app.use(express.favicon());
app.use(express.cookieParser());
app.use(middleware.setSession(app, redisStore, express, '/pointMall'));
app.use(app.router)

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'public', 'pointMall')));
app.set('views', path.join(__dirname, '..', 'views', 'pointMall'));

app.use(middleware.getIntegralUnit);

app.get('/home', routes.home);

app.get('/error', mError.getError);

app.get('/goto/video/goods/player/:id', routes.midAuth(), routes.midAuthUser(true), mGoods.midGoodsLoader(), videoPlayer.gotoVideoPlayer);
app.get('/goods/:id/video/res', routes.midAuth(), routes.midAuthUser(false), mGoods.midGoodsLoader(), videoPlayer.getGoodsVideoRes);
app.post('/add/player/history', routes.midAuth(), routes.midAuthUser(false), videoPlayer.addPlayerHistory);
app.post('/remove/player/history', routes.midAuth(), routes.midAuthUser(false), videoPlayer.delPlayerHistory);
app.get('/player/history', routes.midAuth(), routes.midAuthUser(false), videoPlayer.playerHistory);
app.get('/goto/player/history', routes.midAuth(), routes.midAuthUser(false), videoPlayer.gotoPlayerHistory);
app.post('/video/player/sign', routes.midAuth(), routes.midAuthUser(false), videoPlayer.videoSign);

app.get('/raise/goods/:id/progress', routes.midAuth(false), routes.midAuthUser(false), mGoods.midGoodsLoader(), mGoods.getRaiseGoodsProgress);
app.post('/goods/gain/info', routes.midAuth(), routes.midAuthUser(false), mGoods.loadGoodsGainInfo);

//for lottery
app.get('/activity/:id/goods', routes.midAuth(false), routes.midAuthUser(false), mActivity.midActivityLoader, mActivity.getGoods);
app.get('/lottery/rule', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), mLottery.authLotteryRule);
app.get('/redirect/lottery/bound', routes.midAuth(false), middleware.getIntegralUnit, routes.midAuthUser(false), routes.checkUserIsFollow, mLottery.goLotteryRule);
app.get('/lottery/entry/activity/:id', middleware.checkAuthAndRedirect('activities', 'id'), routes.midAuth(false), middleware.getIntegralUnit, routes.midAuthUser(false), routes.checkUserIsFollow, mActivity.midActivityLoader, mLottery.gotoLottery);
app.get('/lottery/activity/:id', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), routes.checkUserIsFollow, mActivity.midActivityLoader, mLottery.authLottery);
app.get('/lottery/activity/:id/draw', routes.midAuth(false), routes.midAuthUser(false), mActivity.midActivityLoader, middleware.checkLotteryEnable, mLottery.checkUserIntegral, prizePool.checkUserLotteryTimes, mLottery.draw);
app.get('/lottery/add/black/list', prizePool.setBlackUser);

app.get('/check/user/new/order', routes.midAuth(false), routes.midAuthUser(false), mLottery.checkUserUnCompleteOrder);
app.get('/lottery/list/rank', routes.midAuth(false), routes.midAuthUser(false), middleware.midPageChecker(20), mLottery.midRankLoader, mLottery.listLottery);

//for account
app.get('/auth/me/order/list', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), mAccount.gotoMyOrderList);
app.get('/me/account', routes.midAuth(), routes.midAuthUser(false), mAccount.gotoMyAccount);
app.get('/me/order/list', routes.midAuth(false), routes.midAuthUser(false), middleware.midPageChecker(20), mLottery.listLottery);
app.get('/go/me/order/list', routes.midAuth(false), routes.midAuthUser(false), mLottery.gotoMeOrderList);
app.get('/me/order/:id/detail', routes.midAuth(false), routes.midAuthUser(false), mLottery.midLotteryLoader, mLottery.gotoMeOrderDetail);
app.get('/go/me/red/pager/list', routes.midAuth(false), routes.midAuthUser(false), mRedPager.gotoMeRedPagerList);
app.get('/me/red/pager/list', routes.midAuth(false), routes.midAuthUser(false), mRedPager.meRedPagerList);

app.post('/store/share/:id', routes.midAuth(), routes.midAuthUser(false), mStore.midStoreLoader, mWxShare.getJsShareParam, mWxShare.getStoreShareParam);
app.get('/enter/store/:id', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), routes.checkUserIsFollow, mStore.midStoreLoader, mStore.authStore);
app.get('/inter/store/:id', middleware.checkAuthAndRedirect('stores', 'id'), routes.midAuth(), middleware.getIntegralUnit, routes.midAuthUser(false), mStore.midStoreLoader, mStore.gotoStore);
app.get('/goods/detail', middleware.checkAuthAndRedirect('goods', 'id'), routes.midAuth(), middleware.getIntegralUnit, routes.midAuthUser(false), routes.checkUserIsFollow, mGoods.midGoodsLoader(), middleware.checkLimitCountToBuy, mStore.gotoGoodsDetail);
app.get('/goods/:id/info', routes.midAuth(), routes.midAuthUser(false), mGoods.midGoodsLoader(), mGoods.goodsInfo);

//for 3rd
app.get('/auth/goods/:id', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), middleware.third, mStore.authGoods);
app.post('/goods/share/:id', routes.midAuth(), routes.midAuthUser(false), mGoods.midGoodsLoader(), mWxShare.getJsShareParam, mWxShare.getGoodsShareParam);

app.post('/lottery/:id/exchange/goods/:goodsId', routes.midAuth(false), routes.midAuthUser(false), middleware.checkExchangeLock('goodsId'), mLottery.midLotteryLoader, mGoods.midGoodsLoader('goodsId'), mLottery.doExchange);
app.get('/goto/exchange/goods/:id', routes.midAuth(), middleware.getIntegralUnit, routes.midAuthUser(false), mGoods.midGoodsLoader(), mStore.gotoExchange);
app.post('/exchange/goods/:id', routes.midAuth(), routes.midAuthUser(false), middleware.checkExchangeLock(), mGoods.midGoodsLoader(), middleware.checkLimitCount, mStore.checkExchangeUserIntegral, mStore.doExchange);
app.get('/exchange/goods/:id/success', routes.midAuth(), middleware.getIntegralUnit, routes.midAuthUser(false), mGoods.midGoodsLoader(), mStore.gotoExchangeSuccess);

app.post('/goods/:id/wxpay/order', routes.midAuth(), routes.midAuthUser(), middleware.getIp, middleware.checkExchangeLock(), mGoods.midGoodsLoader(), middleware.checkLimitCount, mStore.checkUserIntegral, wxPay.goPay)
app.get('/goods/wxpay', routes.midAuth(), middleware.getIntegralUnit, routes.midAuthUser(false), mGoods.midGoodsLoader(), mStore.getInter, mStore.gotoSubmitOrder)
app.get('/goods/:id/submit/order', routes.midAuth(), routes.midAuthUser(false), mGoods.midGoodsLoader(), mStore.goodsOrder)
app.get('/pay/goods/:id/success', routes.midAuth(), routes.midAuthUser(false), mGoods.midGoodsLoader(), mStore.gotoPaySuccess);
app.post('/wxpay/result', wxPay.payResult)
app.get('/wxpay/order', routes.midAuth(), routes.midAuthUser(), wxPay.orderState)
app.post('/wxpay/cancel/order', routes.midAuth(), routes.midAuthUser(), wxPay.cancelPay)
app.get('/wxpay/address/param', routes.midAuth(), routes.midAuthUser(), wxPay.addressParam)
app.get('/wxpay/verify/goods', mLottery.verifyUserGoods)
app.get('/wxpay/goods/buyer', mLottery.listUser)
app.post('/verify/demand/goods', routes.midAuth(), routes.midAuthUser(), mLottery.verifyVideoGoods)
app.post('/wxpay/warning', wxPay.warning)

app.get('/enter/redPager/:id', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.enterRedPager);
app.get('/inner/redPager/:id', routes.midAuth(), routes.midAuthUser(false), mRedPagerEvent.midRedPagerLoader, mRedPagerEvent.redPagerResult);
app.get('/redPagerEvent/:id/result', routes.midAuth(), routes.midAuthUser(), routes.checkUserIsFollow, mRedPagerEvent.checkUserFollowed, mRedPagerEvent.midRedPagerLoader, middleware.checkRedPagerEnable, mRedPagerEvent.checkUserRedPagerTimes, mRedPagerEvent.drawRedPager);
app.get('/redPagerEvent/:id/bound/list', routes.midAuth(), routes.midAuthUser(false), mRedPagerEvent.midRedPagerLoader, middleware.midPageChecker(20), mRedPagerEvent.loadBoundList);
app.get('/me/enable/redPager/list', routes.midAuth(), routes.midAuthUser(), mRedPagerEvent.listEnableRedPager);

//app.get('/me/enable/mallCard/list', routes.midAuth(), routes.midAuthUser(), mallCard.listEnableCard);

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
app.get('/address/write', middleware.checkAuthSign, routes.authToken('wx_token'), routes.midAuthOpenId('openid'), routes.checkUserIsFollow, mAddress.authOrderId, mAddress.write);
app.post('/address/reselect',routes.midAuth(),  mAddress.reselect);
app.get('/address/getAddress', mAddress.getAddress);
app.get('/address/lists', mAddress.list);

//for file
app.get('/i/:fileId', mFile.getFile);

//bind mobile
app.get('/gv', routes.midAuth(), routes.midAuthUser(), mGv.generate)
app.get('/bind/mobile', routes.midAuth(), routes.midAuthUser(), mUser.gotoBindMobile)
app.post('/bind/mobile', routes.midAuth(), routes.midAuthUser(), mUser.bindMobile)
app.post('/verify/code', routes.midAuth(), routes.midAuthUser(), mUser.verifyGvCode)
app.get('/user/bind/mobile', routes.midAuth(), routes.midAuthUser(true), mUser.getUserMobile)

app.post('/video/player/share/:id', routes.midAuth(), routes.midAuthUser(), mWxShare.getJsShareParam, mGoods.midGoodsLoader(), mWxShare.getVideoShareParam)

app.get('/scanQrCode', function(req, res){
    res.render('scanQrCode')
});
app.post('/card/jssdk/param', mCard.groupToken, mWxShare.getJsShareParam, mCard.getCardApiTicket, mCard.generateJsShareParam)
app.post('/card/choose/jssdk/param', mCard.groupToken, mWxShare.getJsShareParam, mCard.getCardApiTicket, mCard.generateChooseCardJsParam)
app.get('/card/:id', mCard.midCardLoaderByCardId(), mCard.receiveCard)
app.post('/card/event/deal', mCard.dealWxCardEvent)

