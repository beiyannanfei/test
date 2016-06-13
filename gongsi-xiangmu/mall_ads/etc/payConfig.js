var fs = require('fs');
var path = require('path');

var cjtdpayKey = 'dcd7c26bd69e8b16ebd64bdf201da09d';
var cjtdBaseConfig = {
    appid: 'wxfb80ea25b8a85a64',
    mch_id: '1218442201',
    trade_type: "JSAPI"
}

var wdspayKey = 'dcd7c26bd69e8b16ebd64bdf201da09d';
var wdsdBaseConfig = {
    appid: 'wx0eefb7bdf35016a5',
    mch_id: '10028204',
    trade_type: "JSAPI"
}

exports.payKey = 'dcd7c26bd69e8b16ebd64bdf201da09d';
exports.baseConfig = {
    appid: 'wx332b3675959184ee',
    mch_id: '1227555302',
    trade_type: "JSAPI"
}

exports.wx_ssl_options = {
    key: fs.readFileSync(path.join(__dirname, '..', 'etc') + '/pay-key.pem'),
    cert: fs.readFileSync(path.join(__dirname, '..', 'etc') + '/pay-cert.pem')
};

exports.redkey = 'dcd7c26bd69e8b16ebd64bdf201da091';