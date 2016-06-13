/**
 * Created by zwb on 2014/12/19.
 */



var request = require('superagent');
var url = require('url');
var _ = require('underscore');

var crypto = require('crypto');
var moment = require('moment');

function sms() {

    var accountSid = 'aaf98f894a70a61d014a75eb82be03b9';
    var authToken = '674266a677be49f0891715430c416a87';
    var appid = '8a48b5514a61a814014a75eeaf2e0c79';

//    var accountSid = 'aaf98f894a70a61d014a75eb82be03b9';
//    var authToken = '674266a677be49f0891715430c416a87';
//    var appid = 'aaf98f894a70a61d014a75ecd97f03be';

    var sjc = moment(new Date()).format('YYYYMMDDHHmmss');
    console.log('sjc',sjc);

    var str =accountSid+authToken+ sjc; //账户Id + 账户授权令牌 + 时间戳  式"yyyyMMddHHmmss"。时间戳有效时间为24小时，如：20140416142030
    console.log('str',str);
    var md5 = crypto.createHash('md5');
    var sig = md5.update(str);
    sig = md5.digest('hex');
    sig = sig.toUpperCase();
//    var url = 'https://sandboxapp.cloopen.com:8883/2013-12-26/Accounts/'+accountSid+'/SMS/TemplateSMS?sig='+sig;

    var url = 'https://app.cloopen.com:8883/2013-12-26/Accounts/'+accountSid+'/SMS/TemplateSMS?sig='+sig;

    console.log(url);

    var number = generateMixed(6);

    var AuthorizationStr = accountSid+':'+sjc;

    var Authorization = new Buffer(AuthorizationStr).toString('base64');

    var options = {
        'to':'18810788189',//'18600797968',//'18501376089',//'18600139202,18810788189,15901093637',
        'appId': appid,
        'templateId': '12128',
        'datas': [number,3]//['您的验证码是'+number]
    };
    request.post(url)
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', Authorization)
        .send(options)
        .accept('application/json')
        .end(function (err, res) {

            if (err) {
                console.log(err);
            }

            console.log('------statusCode------', res.statusCode);
            console.log(res.text);

        });
}

function generateMixed(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*35);
        id = parseInt(id);
        res += chars[id];
    }
    return res;
}

function SMSNetwork(){
    var ac = '1001@501016050001';
    var authkey = 'C873E15CD442F98BD1D121D687AB25BA';
    var cgid = '52';
    var c = '【天脉商城】您的验证码是tvm，请于3分钟内正确输入';
    var m = '18810788189';

    var url = 'http://smsapi.c123.cn/OpenPlatform/OpenApi?action=sendOnce&ac='+ac+'&authkey='+authkey+'&cgid='+cgid+'&c='+c+'&m='+m;
    console.log(url);

    request.post(url)
        .set('Content-Type', 'application/json;charset=utf-8')
        .accept('application/json')
        .end(function (err, res) {

            if (err) {
                console.log(err);
            }

            console.log('------statusCode------', res.statusCode);
            console.log(res.text);

        });
}



function httpSMS(){

    var mobileNumber = '13141076376';//'13141076376';
    var sigtime = new moment().valueOf().toString();
    var key = '03a4597bb077a4a077254d0e1b9c6103';
    var str = mobileNumber+':'+key+':'+sigtime;
    var md5 = crypto.createHash('md5');
    var sig = md5.update(str);
    sig = md5.digest('hex');


    request.post('http://127.0.0.1:6001/pointMall/sms/send')
        .type('json')
        .send({
            'mobileNumber':mobileNumber,
            'sigtime': sigtime,
            'sig':sig
        }).end(function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.text);
            }
        });
}

//SMSNetwork();
//sms();

httpSMS();