/**
 * Created by chenjie on 2015/1/26.
 */

var ut = require('./utils')
var dbUtils = require('../mongoSkin/mongoUtils.js');
var userCollection = new dbUtils('users');

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
    var email = req.param('email')

    var UPDATE_SPEC = {$set: {mobile: mobile}}
    if (name){
        UPDATE_SPEC.$set.name = name
    }
    if (email){
        UPDATE_SPEC.$set.email = email
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
    userCollection.updateById(id, UPDATE_SPEC, function(err, o){
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
        res.send({})
    }
}

exports.updateUserToVip = function(token, openId, day, vipType, goodsId, count){
    if (day == 0){
        return
    }
    if (!count){
        count = 1
    }
    var _id = token + '_' + openId
    var UPDATE_SPEC = {$set: {}}
    userCollection.findById(_id, function(err, user){
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
            userCollection.updateById(_id, UPDATE_SPEC, function(err, o){

            })
        } else {

        }
    })

}

exports.getUsers = function(openIds, cb) {
    var condition = {
        openId: {$in: openIds}
    }
    userCollection.find(condition, {nickName: 1, headImg: 1}, function(err, docs){
        if (err){
            cb([])
        } else {
            cb(null, docs)
        }
    })
}
/*检查是否为点播vip
* "vip" : {
 "forums" : {
 "endDate" : ISODate("2015-08-14T12:30:40.650Z")
 }
 },
* */
exports.checkDemandVip=function(token,userid,cb){
    var vipType="demand";
    var result=false;
    userCollection.findById(token+"_"+userid,function(err,user){
        if (user){
            if (user.vip && user.vip[vipType] && user.vip[vipType].endDate){
                if(user.vip[vipType].endDate.getTime() > new Date().getTime()){
                    result= true;
                }
            }
        }
        cb(result);
    });
}