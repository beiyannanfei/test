/**
 * Created by chenjie on 2015/1/26.
 */

var ut = require('./utils')
var models      = require('../models/index');
var Users    = models.Users;
var UsersPoint    = models.UsersPoint;


exports.gotoBindMobile = function(req, res){
    res.render('binding-mobile')
}

exports.bindMobile = function(req, res){
    /*var gv = req.session.gv;
    var gvCode = req.param('gvCode')
    if (!gvCode || !gv){
        return res.send(400, '验证码不正确')
    }
    if (gvCode.toUpperCase() != gv.toUpperCase()){
        return res.send(400, '验证码不正确')
    }*/

    var mobile = req.param('mobile')
    if (!ut.isMobile(mobile)){
        return res.send(400, '手机号格式不正确')
    }
    var name = req.param('name')
    var UPDATE_SPEC = {$set: {mobile: mobile}}
    if (name){
        UPDATE_SPEC.$set.name = name
    }

    if (!req.user){
        return res.send(401);
    }
    exports.updateUser(req.token + '_' + req.openId, UPDATE_SPEC, function(err, o){
        if (err){
            res.send(500, err);
        } else {
            res.send(200);
        }
    })
}

exports.updateUser = function(id, UPDATE_SPEC, callback){
    Users.findByIdAndUpdate(id, UPDATE_SPEC, function(err, o){
        if (err){
            callback(err)
        } else {
            callback()
        }
    })
}

exports.verifyGvCode = function(req, res){
    var gv = req.session.gv;
    var gvCode = req.param('gvCode')
    if (!gvCode || !gv || gvCode.toString().toUpperCase() != gv.toString().toUpperCase()){
        return res.send(400, '验证码不正确')
    }
    res.send(200);
}

exports.getUserMobile = function(req, res){
    if (req.user && req.user.mobile){
        res.send({name: req.user.name, mobile: req.user.mobile, email: req.user.email})
    } else {
        res.send('')
    }
}

/*exports.updateUserToVip = function(token, openId, day, vipType){
    var _id = token + '_' + openId
    var endTime = new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000)
    var UPDATE_SPEC = {
        $set: {vip: {}}
    }
    UPDATE_SPEC.$set.vip[vipType] = {endDate: endTime}
    Users.findByIdAndUpdate(_id, UPDATE_SPEC, function(err, o){
        if (err){

        }
    })
}*/

exports.updateUserToVip = function(token, openId, day, vipType, goodsId, count){
    if (day == 0){
        return
    }
    if (!count){
        count = 1
    }
    var _id = token + '_' + openId
    var UPDATE_SPEC = {$set: {}}
    Users.findById(_id, function(err, user){
        if (user){
            if (vipType == 'demand'){
                var key = 'vip.' + vipType
                if (user.vip && user.vip[vipType] && user.vip[vipType].endDate){
                    if (user.vip[vipType].endDate.getTime() > new Date().getTime()){
                        UPDATE_SPEC.$set[key] = {endDate: new Date(user.vip[vipType].endDate.getTime() + day * count * 24 * 60 * 60 * 1000)}
                    } else{
                        UPDATE_SPEC.$set[key] = {endDate: new Date(new Date().getTime() + day * count * 24 * 60 * 60 * 1000)}
                    }
                } else {
                    UPDATE_SPEC.$set[key] = {endDate: new Date(new Date().getTime() + day * count * 24 * 60 * 60 * 1000)}
                }
            } else if (vipType == 'forums') {
                var key = 'vip.' + vipType + '.' + goodsId
                if (user.vip && user.vip[vipType] && user.vip[vipType][goodsId] && user.vip[vipType][goodsId].endDate){
                    if (user.vip[vipType][goodsId].endDate.getTime() > new Date().getTime()){
                        UPDATE_SPEC.$set[key] = {endDate: new Date(user.vip[vipType][goodsId].endDate.getTime() + day * count * 24 * 60 * 60 * 1000)}
                    } else{
                        UPDATE_SPEC.$set[key] = {endDate: new Date(new Date().getTime() + day * count * 24 * 60 * 60 * 1000)}
                    }
                } else {
                    UPDATE_SPEC.$set[key] = {endDate: new Date(new Date().getTime() + day * count * 24 * 60 * 60 * 1000)}
                }
            }
            console.log('update user vip:')
            console.log(UPDATE_SPEC)
            Users.findByIdAndUpdate(_id, UPDATE_SPEC, function(err, o){

            })
        } else {

        }
    })

}

exports.savePointUser = function(userInfo, cb){
    var user = new UsersPoint(userInfo);
    user.save(function (err, doc) {
        if (err) {
            cb?cb(err):''
        } else {
            if (doc) {
                cb?cb(null, doc):''
            } else {
                cb?cb('err'):''
            }
        }
    });
}

exports.saveMallUser = function(userInfo, cb){
    var user = new Users(userInfo);
    user.save(function (err, doc) {
        if (err) {
            cb?cb(err):''
        } else {
            if (doc) {
                cb?cb(null, doc):''
            } else {
                cb?cb('err'):''
            }
        }
    });
}

exports.saveUser = function(userInfo, first, cb){
    if (first){
        exports.savePointUser(userInfo, function(err, doc){
            cb(err, doc)
            exports.saveMallUser(userInfo)
        })
    } else {
        exports.saveMallUser(userInfo, function(err, doc){
            cb(err, doc)
            exports.savePointUser(userInfo)
        })
    }
}