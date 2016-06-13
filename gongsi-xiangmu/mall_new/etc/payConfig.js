var fs = require('fs');
var path = require('path');

exports.payToken = ['f58a6e8834f3', 'ceca73efe351', '8b7ef31db230', '13992b27e90a', '70c69789da7c', 'fc640ef602a9','61510b00acd4', 'c9a6828b3b1b']
var payConfig = {
    "DEFAULT_MALL": {      //电视微商城
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da092',
        baseConfig: {
            appid: 'wx7199914c7d6aabb7',
            mch_id: '1284967001',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', '10663ea56754') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', '10663ea56754') + '/pay-cert.pem')
        }
    },
    "acb7bef486a4":{
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da09d',
        baseConfig: {
            appid: 'wx686bdb7e040b2222',
            mch_id: '1276865101',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', 'acb7bef486a4') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', 'acb7bef486a4') + '/pay-cert.pem')
        }
    },
    "35o4zts2mwgdenkvpqrf0u": {
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da09d',
        baseConfig: {
            appid: 'wx332b3675959184ee',
            mch_id: '1227555302',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc') + '/pay-cert.pem')
        }
    },
    '8b7ef31db230': {
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da09d',
        baseConfig: {
            appid: 'wxe77a1f126d505d33',
            mch_id: '1239118602',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', '8b7ef31db230') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', '8b7ef31db230') + '/pay-cert.pem')
        }
    },
    'ceca73efe351': {
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da09d',
        baseConfig: {
            appid: 'wx15670746b7a7cd98',
            mch_id: '1241838602',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', 'ceca73efe351') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', 'ceca73efe351') + '/pay-cert.pem')
        }
    },
    'f58a6e8834f3': {
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da09d',
        baseConfig: {
            appid: 'wx39780a946f4dfbcc',
            mch_id: '1245200002',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', 'f58a6e8834f3') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', 'f58a6e8834f3') + '/pay-cert.pem')
        }
    },
    '13992b27e90a': {
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da09d',
        baseConfig: {
            appid: 'wx5be9593d2a32bfde',
            mch_id: '10152686',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', '13992b27e90a') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', '13992b27e90a') + '/pay-cert.pem')
        }
    },
    '70c69789da7c': {
        payKey: 'bisianyuejingjingandiroushu99999',
        baseConfig: {
            appid: 'wx1692c11d80af07e4',
            mch_id: '1250679901',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', '70c69789da7c') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', '70c69789da7c') + '/pay-cert.pem')
        }
    },
    'fc640ef602a9': {
        payKey: 'qwertyuioplkjhgfdsazxcvbnmqwerty',
        baseConfig: {
            appid: 'wx6d145e440ac573b1',
            mch_id: '1244943702',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', 'fc640ef602a9') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', 'fc640ef602a9') + '/pay-cert.pem')
        }
    },
    '61510b00acd4': {
        payKey: 'a1b2c3d4e5f6g7h8j9k10l11m12n13o1',
        baseConfig: {
            appid: 'wxce07d49b1db2d775',
            mch_id: '1239813902',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', '61510b00acd4') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', '61510b00acd4') + '/pay-cert.pem')
        }
    },
    'c9a6828b3b1b': {
        payKey: 'a1b2c3d4e5f6g7h8j9k10l11m12n14o1',
        baseConfig: {
            appid: 'wxd1db3ececce7a9ba',
            mch_id: '1268173801',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', 'c9a6828b3b1b') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', 'c9a6828b3b1b') + '/pay-cert.pem')
        }
    }
}

exports.getPayKey = function(token){
    if (payConfig[token]){
        return payConfig[token].payKey
    } else {
        return payConfig.DEFAULT_MALL.payKey
    }
}

exports.getBaseConfig = function(token){
    if (payConfig[token]){
        return payConfig[token].baseConfig
    } else {
        return payConfig.DEFAULT_MALL.baseConfig
    }
}

exports.getWxSsl = function(token){
    if (payConfig[token]){
        return payConfig[token].wx_ssl_options
    } else {
        return payConfig.DEFAULT_MALL.wx_ssl_options
    }
}