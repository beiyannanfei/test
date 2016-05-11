/**
 * Created by wyq on 2015/7/30.
 */
var request = require('superagent');

var url = "yao.mtq.tvm.cn/api/yaotv/auth?yyyappid=wx33dc1a5264b4e846&action=getUserInfo&openid=onC35t7iHt1ZmirLlzou3cQE1B6g";

url = "http://localhost:6600/admin?abc=123&edc=erds";
var test = function () {
    request.get(url, function (err, res) {
        console.log("******** arg: %j", arguments);
    })
};

test();

var a = {
    '0': null,
    '1': {
        req: {
            method: 'GET',
            url: 'yao.mtq.tvm.cn/api/yaotv/auth?yyyappid=wx33dc1a5264b4e846&action=getUserInfo&openid=onC35t7iHt1ZmirLlzou3cQE1B6g'
        },
        header: {
            date: 'Thu, 30 Jul 2015 09:22:45 GMT',
            'content-type': 'application/json;charset=utf-8',
            'transfer-encoding': 'chunked',
            connection: 'close',
            'access-control-allow-origin': '*'
        },
        status: 200,
        text: '{"city":"Daxing","province":"Beijing","ret":"0","openid":"onC35t7iHt1ZmirLlzou3cQE1B6g","status":"ok","country":"CN",' +
            '"resTime":1438248165,"errmsg":"",' +
            '"headimgurl":"http:\\/\\/wx.qlogo.cn\\/mmopen\\/ibbRqs9nGAgAdtcgkO4zmM0RQBd6bcx3BALSSZeicReIBBLyicibto4eUlQmKhYgdbicZjvOHQ0q9ItCflpbRZwBmdBC2XCaM2jlx",' +
            '"sex":"2","nickname":"平安是福"}'
    }
};

