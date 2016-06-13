/**
 * Created by nice on 2014/9/15.
 */


var events = require('events'),
    xml2js = require('xml2js');

var tools = require('../tools');
var event  = require('./dealEvent');

exports.index = function(req,res){
    var wxToken = req.query.wx_token || '';
    console.log('==================微信事件==================',wxToken);
    if(wxToken){
        // 获取XML内容
        var buf = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
            buf += chunk;
        });
        // 内容接收完毕
        req.on('end', function() {
            xml2js.parseString(buf, function(err, json) {
                if (err) {
                    err.status = 400;
                } else {
                    req.body = json;
                }
                if(req.body && req.body.xml){
                    var data = req.body.xml;
                    var msgType = data.MsgType[0] ? data.MsgType[0] : "text";
                    console.log('====================微信事件  事件类型=================',msgType);
                    switch(msgType) {
                        case 'text' :
                            break;
                        case 'image' :
                            break;
                        case 'location' :
                            break;
                        case 'link' :
                            break;
                        case 'voice' :
                            break;
                        case 'video' :
                            break;
                        case 'event' :
                            event.index(data,wxToken);
                            break;
                    }
                }else{
                    console.log('req.body.xml is null !');
                }
            });
        });
    }else{
        console.log('wx_token is null');
    }
};