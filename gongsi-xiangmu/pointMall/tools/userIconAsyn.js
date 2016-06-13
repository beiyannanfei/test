var interface = require('../interface');
var models = require('../models/index');
var wxInfo = require('../routes/wxInfo');
var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var fs = require('fs')

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var moment = require('moment');
var _ = require('underscore');
var async = require('async');

var Users = models.Users;

process.maxTickDepth = Number.MAX_VALUE;

var wxToken = '3a59f7a4b8b28dca';

var exit = function(code){
    setTimeout(function(){
        process.exit(code);
    }, 1000)
}

var xmlParse = function(callback){
    var data = fs.readFileSync('./user.xml')
    parseString(data, {}, function (err, result) {
        if (err) {
            console.log('---解析XML报错，不是合法的xml---', err);
            callback(null);
        } else {
            if (result && result != 'undefined') {
                callback(result);
            } else {
                callback(null);
            }
        }
    });
}

var updateUser = function (users) {
    console.log(users.length)
    var count = 0;
    async.eachSeries(users, function (user, done) {
        console.log(++count);

        var headImg = user.avatar_url[0];
        var username = user.username[0];
        var openId = user.openid[0];
        if (!headImg || headImg == 'undefined' || headImg == '/images/default_photo_album.jpg') {
            return done()
        } else {
            headImg = 'http://v4.tv.cctv5.tvm.cn/data/weixin_data/' + headImg  + '_96_96.jpg';
        }

        if (!username || username == 'undefined' || username == 'Gest') {
            return done()
        }

        console.log(headImg)
        console.log(wxToken + '_' + openId)
        Users.findByIdAndUpdate(wxToken + '_' + openId, {$set: {headImg: headImg, nickName: username}}, function (err) {
            if (err) {
                console.log('update user err:' + err)
                return exit(-1)
            }
            done()
        })
    }, function (err) {
        if (err) {
            console.log(err);
            return exit(-1)
        } else {
            console.log('update Users success')
            return exit(0);
        }
    });
}

xmlParse(function(data){
    if (!data || !data.RECORDS){
        console.log('data is null')
        return exit(-1)
    }

    var users = data.RECORDS.RECORD;

    if (!_.isArray(users)){
        console.log('data is not array,')
        console.log(users)
        return exit(-1)
    }
    updateUser(users);
})