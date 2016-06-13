/**
 * Created by nice on 2014/9/15.
 */

var xml2js = require('xml2js');

var wechat = require('../wechat/index');

exports.index = function (req, res) {
    wechat.index(req, res);
    res.send('');
//    console.log('===================二维码 扫描事件=====================',req.query.wx_token);
//    // 获取XML内容
//    var buf = '';
//    req.setEncoding('utf8');
//    req.on('data', function(chunk) {
//        buf += chunk;
//    });
//    // 内容接收完毕
//    req.on('end', function() {
//        xml2js.parseString(buf, function(err, json) {
//            if (err) {
//                err.status = 400;
//            } else {
//                req.body = json;
//            }
//            if(req.body && req.body.xml){
//                console.log(req.body.xml);
//            }else{
//                console.log('req.body.xml is null !');
//                res.send('');
//            }
//        });
//    });
};