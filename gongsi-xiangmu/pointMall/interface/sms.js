/**
 * Created by zwb on 2014/12/22.
 */

var request = require('superagent');
var url = require('url');
var _ = require('underscore');

var crypto = require('crypto');
var moment = require('moment');

var smsConfig = require('../SMS.json');
var accountSid = smsConfig.ACCOUNT_SID;
var authToken = smsConfig.AUTH_TOKEN;
var appId = smsConfig.APPID;
var restUrl= smsConfig.REST_URL;

/**
 *  to	String	必选	短信接收端手机号码集合，用英文逗号分开，每批发送的手机号数量不得超过100个
 *  appId	String	必选	应用Id
 *  templateId	String	必选	模板Id
 *  datas	String	必选	内容数据外层节点
 *  data	String	可选	内容数据，用于替换模板中{序号}
 * @type {sms}
 */
var sms = exports.sms = function(to,templateId, datas,callback){
    var sjc = moment(new Date()).format('YYYYMMDDHHmmss');
    var str =accountSid+authToken+ sjc; //账户Id + 账户授权令牌 + 时间戳  式"yyyyMMddHHmmss"。时间戳有效时间为24小时，如：20140416142030
    var md5 = crypto.createHash('md5');
    var sig = md5.update(str);
    sig = md5.digest('hex');
    sig = sig.toUpperCase();
    var url = restUrl +'/2013-12-26/Accounts/'+accountSid+'/SMS/TemplateSMS?sig='+sig;
    var AuthorizationStr = accountSid+':'+sjc;
    var Authorization = new Buffer(AuthorizationStr).toString('base64');
    var options = {
        'to':to,
        'appId': appId,
        'templateId': templateId,
        'datas': datas
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
            console.log('====================发送短信返回信息=====================');
            console.log(res.text);
            if(res.statusCode && res.statusCode=='200'){
                callback(res.text);
            }else{
                callback(null);
            }
        });
};