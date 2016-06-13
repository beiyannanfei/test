/**
 * User: nice
 * Date: 14-5-12
 * Time: 下午10:14
 */

var request = require('superagent');
var url = require('url');
var _ = require('underscore');
var moment = require('moment');

var crypto = require('crypto');

function integral(){
//    request.post('http://hudong-qa.tvmining.com/pointMall/integral/minus')
    //request.post('http://127.0.0.1:6001/pointMall/integral/add')
    request.post('http://mall.mtq.tvm.cn/pointMall/integral/minus')
//    request.post('http://10.20.30.53:6001/pointMall/integral/add')
        .type('json')
        .send(
//        {
//            'openId': 'oFNARt_U2tkCGrea5DfSnz65_dm8', //
//            'wxToken': 'dsbl',
//            'integral': 1000,
//            'description': '11111111111111'
//        }
        {
            'openId': 'oX7GJjr6UCPcKeemw4QstIRn4jEA', //
            'wxToken': 'tvmcj',
            'integral': 1000,
            'description': '测试'
        }
    ).end(function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.text);
            }
        });
}

function behavior(){
    request.post('http://mall.mtq.tvm.cn/pointMall/behavior/add')
        .type('json')
        .send({
            'openId': 'oux1puKB73jHSGFIZYkGGlnOh1sc',
            'wxToken': 'tvmty',
            'behavior': '推荐好友',
            'area': '中国-北京',
            'description': ''
        }).end(function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.text);
            }
        });
}

function test(){
    //request.post('http://iwmh.tvmining.com/index.php?g=User&m=Sign&a=add&token=zyc839')
    //.type('form')
    request.post('http://hudong-qa.tvmining.com/pointMall/qrcode/index')
        .type('json')
        .send({
            'integral': 10,
            'token': 'tvmty',
            'tw_id': 'TVM001',
            'greetings': '中国-北京',
            'tw_html': '<html>sssssssssssssssssssssssssssssssssssssssssssssss</html>'
        }).end(function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.text);
            }
        });
}

function watch(){
    request.post('http://hudong-qa.tvmining.com/pointMall/personal/watch')
    //request.post('http://127.0.0.1:6001/pointMall/personal/watch')
        .type('json')
        .send({
            'openId': 'ocKZ5uE2AruV0MIG19ZwHuf3hkGA',
            'wxToken': 'zyc839',
            'description': '关注'
        }).end(function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.text);
            }
        });
}


//watch();


function groups(){
        request.post('http://127.0.0.1:6001/pointMall/groups/add')
        .type('json')
        .send({
                groupName:'边看边聊-001',
                wxToken: 'tvmty',
                behavior:'边看边聊'
        }).end(function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.text);
            }
        });
}


function wxrefreshuser(){
    var userHost = 'http://mb.mtq.tvm.cn';
    var token = '7fda67277f';
    var wxToken = '365a281990c502ed';
    var openId = 'oLL61s3rqyLA35FoC_gKO3Gpz-24';

    var url = userHost + '/rest/wxrefreshuser?token=' + token;
    var params = {
        weixin_token: wxToken,
        openid: openId
    };
    console.log('--------------------------url-------------------------------');
    console.log(url);
    console.log('--------------------------params-------------------------------');
    console.log(params);
    var options = _.extend({}, params);
    request.post(url)
        .type('application/x-www-form-urlencoded')
        .send(options)
        .accept('text/json')
        .end(function (err, res) {
            if (err) {
                console.log(err);
            }
            console.log('--------------------------res.statusCode-------------------------------');
            console.log(res.statusCode);
            if (res.statusCode == 200) {
                if (res.text) {
                    var body = JSON.parse(res.text);
                    console.log('--------------------------body-------------------------------');
                    console.log(body);
                }
            }
        });
}

function userGroup(){
    var url = 'http://mall.mtq.tvm.cn/pointMall/userGroup/add';
//    var url = 'http://a.mall.mtq.tvm.cn/pointMall/userGroup/add';
//        url = 'http://127.0.0.1:6001/pointMall/userGroup/add';
//        url = 'http://hudong-qa.tvmining.com/pointMall/userGroup/add';
    request.post(url)
        .type('json')
        .send({
            'openId':'oux1puLLtHRV-mEyIz0EXNd17zHo',//,oX7GJjumQe8BZ0-DSDEm3SHsmyjw,oPKamjsl7wGIC9JrvmKkEPP8pvCs',// 'oX7GJjumQe8BZ0-DSDEm3SHsmyjw',//'oPKamjsl7wGIC9JrvmKkEPP8pvCs', //
            'wxToken':'tvmty',// 'tvmcj',//'8e8c547795a5fe3c', //
            'activity': 'epg12',
            'title': '每日文娱播报',
            'result': ''
        }).end(function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.text);
            }
        });
}

//userGroup();


function json(){
    var arrary = [];
    arrary.push('a');
    arrary.push('b');
    arrary.push('c');
    arrary.push('d');
    arrary.push('e');
    arrary.push('f');
    console.log(arrary);

    var jsonStr = JSON.stringify(arrary);

    var json = JSON.parse(jsonStr);

    console.log(json[3]);


    console.log(arrary.slice(3,5));

}



function sms(){


    var mobileNumber = '18810788189';//'oHsektzY_9FpNya54j2qC1A1kQ9Y';
    var sigtime = new moment().valueOf().toString();
    var key = '03a4597bb077a4a077254d0e1b9c6103';
    var str = mobileNumber+':'+key+':'+sigtime;
    var md5 = crypto.createHash('md5');
    var sig = md5.update(str);
    sig = md5.digest('hex');


    request.post('http://127.0.0.1:6001/pointMall/sms/send')
        .type('json')
        .send({
            'mobileNumber':'18810788189',
            'sigtime': new moment().valueOf().toString(),
            'sig':sig
        }).end(function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.text);
            }
        });
}
//sms();
//integral();

userGroup();