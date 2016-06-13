var models = require('../models/index');
var OpUser = models.opUser;
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

    OpUser.findOneAndUpdate({token: user.token}, user, {upsert: true}, function(err, doc){
        if (err){
            console.log(err);
            return cb('创建用户失败')
        }
        return cb(null, doc);
    })
}

exports.findOpUser = function(condition, cb){
    OpUser.findOne(condition, function (err, user) {
        cb(err, user)
    });
}

exports.updateOpUser = function(token, UPDATE_SPEC){
    OpUser.update({token: token}, UPDATE_SPEC, function (err) {
        if (err){
            console.log('mongodb error')
        }
    });
}