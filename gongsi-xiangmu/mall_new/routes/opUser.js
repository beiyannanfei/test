var dbUtils = require('../mongoSkin/mongoUtils.js');
var opuserCollection = new dbUtils('opusers');
var config = require('../config');

exports.addUser = function(user, cb){
    if (!user){
        return cb('user not exists');
    } else if (!user.token){
        return cb('oauth_token not exists');
    }

    if (config.NODE_ENV == 'prod'){
        user.password = user.token + '@admin-2%*1^$@';
    } else{
        user.password = 'tvm123456';
    }

    opuserCollection.update({token: user.token}, {$set: user}, {upsert: true}, function(err, doc){
        if (err){
            console.log(err);
            return cb('创建用户失败')
        }
        opuserCollection.find({token: user.token}, function (err, data) {
            if (!!err) {
                console.log(err);
                return cb('查询用户失败')
            }
            return cb(null, data);
        });
    })
}

exports.findOpUser = function(condition, cb){
    opuserCollection.findOne(condition, function (err, user) {
        cb(err, user)
    });
}

exports.updateOpUser = function(token, UPDATE_SPEC){
    opuserCollection.update({token: token}, UPDATE_SPEC, function (err) {
        if (err){
            console.log('mongodb error')
        }
    });
}