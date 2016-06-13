/**
 * Created with JetBrains WebStorm.
 * User: Rubinus
 * Date: 13-6-25
 * Time: 下午1:44
 */
var mongoose = require('mongoose');

var config = require('../config.js');
var NODE_ENV = config.NODE_ENV;

var db = null;

var config_point = require('../config-point.js');
var db_point = null;

var opts = {};
var opts_point = {};
if (NODE_ENV == 'prod' || NODE_ENV == 'wxprod') {
    opts = {
        server: { poolSize: 20 },
        mongos: true,
        replset: {strategy: 'ping', rs_name: 'shop'}
    };
    opts_point = opts;
}else if (NODE_ENV == 'ali') {
    opts = {
        server: { poolSize: 20 },
        mongos: true
//        replset: {strategy: 'ping', rs_name: 'ali'}
    };
    opts_point = {
        server: { poolSize: 20 },
        mongos: true
//        replset: {strategy: 'ping', rs_name: 'ali'}
    };
}

var str = config.mongodb.links;
db = mongoose.createConnection(str, opts, function (error) {
    if (error) {
        console.error('connect to MongoDB %s error: ', error);
        process.exit(1);
    }
});

var str_point = config_point.mongodb.links;
if(str==str_point){
    opts_point = opts;
}
db_point = mongoose.createConnection(str_point, opts_point, function (error) {
    if (error) {
        console.error('connect to MongoDB %s error: ', error);
        process.exit(1);
    }
});

exports.getDb = function () {
    return db.db;
};

exports.getMDb = function(){
    return db;
};

exports.getGridStore = function () {
    return mongoose.mongo.GridStore;
};

require('./lottery');
require('./goods');
require('./activity');
require('./address');
require('./opUser');
require('./lotteryEvent');
require('./notice');
require('./lotteryStatistics');
require('./store');
require('./wxOrder');
require('./redPagerEvent');
require('./redPagerRecord');
require('./dailyRecord');
require('./playerHistory');
require('./mallcard');

require('./users');
require('./integralLog');
require('./behavior');
require('./groups');
require('./groupUsers');
require('./personal');
require('./sms');
require('./groupUserIds');

//exports.Users = db.model('Users');
//exports.Behavior = db.model('Behavior');
//exports.IntegralLog = db.model('IntegralLog');
//exports.Groups = db.model('Groups');
//exports.GroupUsers = db.model('GroupUsers');
//exports.Personal = db.model('Personal');
//exports.SMS = db.model('SMS');
//exports.GroupUserIds = db.model('GroupUserIds');

exports.UsersPoint = db_point.model('Users');
exports.Behavior = db_point.model('Behavior');
exports.IntegralLog = db_point.model('IntegralLog');
exports.Groups = db_point.model('Groups');
exports.GroupUsers = db_point.model('GroupUsers');
exports.Personal = db_point.model('Personal');
exports.GroupUserIds = db_point.model('GroupUserIds');

exports.Users = db.model('Users');
exports.SMS = db.model('SMS');
exports.Lottery = db.model('Lottery');
exports.Goods = db.model('Goods');
exports.Address = db.model('Address');
exports.Activity = db.model('Activity');
exports.opUser = db.model('OpUser');
exports.lotteryEvent = db.model('LotteryEvent');
exports.Notice = db.model('Notice');
exports.LotteryStatistics = db.model('LotteryStatistics');
exports.Store = db.model('Store');
exports.WxOrder = db.model('WxOrder');
exports.RedPagerEvent = db.model('RedPagerEvent');
exports.RedPagerRecord = db.model('RedPagerRecord');
exports.PlayerHistory = db.model('PlayerHistory');
exports.MallCard = db.model('MallCard');

//for statistics
exports.DailyRecord = db.model('DailyRecord');

exports.close = function () {
    db.close(function () {
        console.log('Close Mongodb !');
    });
};