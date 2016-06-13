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

//���js param
app.post('/hongbao/js/param', openController.getCheckUser, mWxRedLottery.midWxRedLotteryLoader(), mWxRedLottery.jsParam);
app.post('/3rd/hongbao/js/param', openController.get3rdCheckUser, mWxRedLottery.midWxRedLotteryLoader(), mWxRedLottery.jsParam);

//��ȯjs param
app.post('/card/jssdk/param', openController.getCheckUser, orders.midOrderLoader(), mCard.checkCardState, mCard.getCardApiTicket, mWxShare.getJsShareParam, mCard.generateCardJsParam)
//zpp
app.post('/card/js/param', openController.getCheckUser, openController.checkyyyappId, mCard.getCardApiTicket, mWxShare.getJsShareParam, mCard.generateCardJsParam)

//app.post('/card/jssdk/param', mCard.getCardApiTicket)

//��ȯ�¼�
app.post('/card/event/deal', mCard.dealWxCardEvent)

//��ʼ�齱
app.post('/syslottery/start', syslottery.startLottery);
//�齱��ʼ������û���Ϣ�ӿ� ������ȷ��
app.post('/syslottery/receiveuser',openController.checkUser, syslottery.acceptUsers);
//�齱��ʼ �����û� ���۴��������
app.post('/syslottery/receivealluser',openController.checkUser, syslottery.acceptAllUsers);
//��ȡĳ�γ齱���н��û��б� ����Ʒ�ȼ���ʾ
app.get('/syslottery/winlist', openController.getCheckUser,  syslottery.lotteryResult);
//��ȡ�û�ĳ�γ齱���н����
app.get('/syslottery/user/result', openController.getCheckUser,  syslottery.getUserWinInfo);
//��ȡĳ�γ齱�Ľ�Ʒ��Ϣ
app.get('/syslottery/prize/list', openController.getCheckUser,  syslottery.getLotteryPrizes);
//��ȡĳ�γ齱�Ľ��ؽ������
app.get('/syslottery/money', openController.getCheckUser,  syslottery.getMoney);
//�޸Ķ��ϵͳ�齱
app.post('/syslottery/update/copy', createsyslottery.updateMultiLottery);
//����ϵͳ�齱 ��lotteryid �� count
app.get('/syslottery/copy',createsyslottery.copyLottery)

app.get('/syslottery/:lotteryid/getbyid',createsyslottery.getOneLottery);

//�����ʵ�ｱƷ ��Ҫ�����ջ���ַ
app.post('/order/update/address', openController.checkUser, orders.setAddress);
//��ȡ�����100��������Ϣ
app.get('/lottery/rank', orders.getLotteryRank);
//��ȡ��һ�û������ж�����Ϣ
app.get('/order/user/orders',openController.getCheckUser,middleware.midPageChecker(50),orders.getOrdersByUser);
//���ú����ȯ��״̬��Ϣ  δ��0 ����1
app.post('/order/user/prize/state',openController.checkUser,orders.setWxInfoState);


//���齱
app.get('/crazyLottery/prize', mCrazyLottery.getLotteryPrize);
app.post('/crazyLottery/start', mCrazyLottery.startCrazyLottery);
app.post('/crazyLottery/copy', mCrazyLottery.midCrazyLotteryLoader, mCrazyLottery.copyCrazyLottery);
app.post('/crazyLottery/update/copy', mCrazyLottery.midCrazyLotteryLoader, mCrazyLottery.changeCopyCrazyLottery);
app.post('/crazyLottery/draw', openController.checkUser, mCrazyLottery.midCrazyLotteryLoader, /*mCrazyLottery.checkLotteryUserTimes, */mCrazyLottery.drawCrazyLottery);
app.get('/crazyLottery/records', openController.getCheckUser, mCrazyLottery.getLotteryRecords);

app.get('/order/statistics', orderCount.statistics);
//����createTime��ѯ�齱��Ϣ
app.post('/order/getCountInfo', orderCount.getCountInfo);
//�ϱ��콱��Ϣ
app.post('/prize/reportinfo', openController.checkUser, mPrize.reportPrizeInfo);
//��ȡ�콱����
app.get('/orderCount/getprizecount', orderCount.getPrizeCount);
//��ȡĳ��top20���а�
app.get('/order/gettoporder', orders.getTopExcel);
//��ȡĳ��top10������
app.get('/order/gettopdatainfo', orders.getTopDataInfo);
//����ͳ��
app.get('/order/getsummaryinfo', orders.getSummaryInfo);
//������΢�ź���û�ͳ�� �����ͽ��
app.get('/order/countwxredprize', orderCount.countWxredPrize);
//ÿ���н����������û�TOP10	���ṩ΢������ͷ���н��������н���Ϣ��
app.get('/order/gettop10datainfo', orders.getTop10DataInfo);
//������뽱   ��ÿ������6�㿪���󣬵�һ�ֲ����к���󽱵��û���΢������ͷ���н���
app.get('/orderCount/getearliest', orderCount.getEarliestIn);
//������齱  ��ÿ�����Ͻ��賿2�㣬�������һ�λ������н��û�΢������ͷ���н���
app.get('/orderCount/getlatest', orderCount.getLatestIn);



app.post('/error', mError.acceptError);  /*openController.checkUser, */
app.get('/error', mError.getError);

app.get('/auth/wxred/send', openController.getCheckUser,  mWxRed.authSendHongbao);
app.get('/wxred/send', middleware.checkAuthSign, orders.midOrderLoader(), mWxRedLottery.checkWxRedLotteryLoader('wxRedLotteryId'), mWxRed.checkExchangeLock, mWxRed.sendRedPager);
app.post('/wxred/create', openController.check3rdParam, mWxRed.createRed);
app.post('/wxred/send', openController.check3rdParam, mWxRedLottery.checkWxRedLotteryLoader('wxRedLotteryId'), mWxRed.lock('wxRedLotteryId'), mWxRed.sendRedBy3rd);

app.get('/wxred/state', mWxRedLottery.midWxRedLotteryLoader('wxRedLotteryId'), mWxRed.getWxRedState);