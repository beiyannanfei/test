/**
 * Created by Administrator on 2014/8/7.
 */

var ut = require('./utils');
var models = require('../models/index');
var Address = models.Address;
var Users = models.Users;

var _ = require('underscore');

var config = require('../config.js');
var userHost = config.userHost;

var nodeExcel     = require('excel-export');

exports.addAddress = function(req, res){
    var token = req.token;
    var openId = req.openId;
    if (!openId){
        return res.send(400, 'openId不存在')
    }

    if (!req.param('name')){
        return res.send(400, 'name不存在')
    }
    if (!req.param('tel')){
        return res.send(400, 'tel不存在')
    }

    if (!req.param('add')){
        return res.send(400, 'add不存在')
    }

    var orderId = ''
    if (req.param('orderId')){
        orderId =  req.param('orderId');
    }

    var findAddressCount = function(o){
        Address.count({openId: openId, deleted: {$ne: 1}}, function(err, count){
            if (err){
                console.log(err);
                return res.send(500, err)
            } else {
                if (count == 1){
                    setDefault(o);
                } else{
                    res.send(o);
                }
            }
        })
    }

    var save = function(){
        var doc = {
            name: req.param('name'),
            tel: req.param('tel'),
            province: req.param('province') || '',
            city: req.param('city') || '',
            add: req.param('add'),
            zip: req.param('zip'),
            countryCode: req.param('countryCode') || ''
        }
        exports.saveAddress(openId, token, doc, function(err, o){
            if (err){
                console.log(err);
                return res.send(500, err)
            } else{
                if (orderId){
                    exports.addOrderToAddress(o, orderId);
                }
                findAddressCount(o)
            }
        });
    }

    var setDefault = function(address){
        Address.findByIdAndUpdate(address._id, {$set: {isDefault: 1}}, function(err, o){
            if (err){
                console.log(err);
                return res.send(500, err)
            } else{
                console.log(o)
                res.send(o);
            }
        })
    }
    save()
}

exports.saveAddress = function(openId, token, addInfo, callback){
    if (!openId){
        return callback('openId is null');
    }

    if (!addInfo){
        return callback('addInfo is null');
    }

    if (!addInfo.name || !addInfo.tel || !addInfo.add){
        return callback('content of addInfo error');
    }

    var doc = {
        openId: openId,
        token: token,
        addInfo: addInfo
    }

    Address.findOne(doc, function(err, add){
        if (err){
            console.log(doc);
            return callback('find address mongodb error!');
        } else if (add){
            callback(null, add);
        } else{
            new Address(doc).save(function(err, o){
                if (err){
                    callback(err);
                } else if (!o){
                    callback('mongodb error');
                } else{
                    callback(null, o);
                }
            })
        }
    })
}

exports.setDefault = function(req, res){
    var openId = req.openId;
    if (!openId){
        return res.send(400, 'openId参数不存在')
    }
    var addressId = req.param('addressId')
    if (!addressId){
        return res.send(400, 'addressId参数不存在')
    }
    var resetDefault = function(){
        Address.update({openId: openId, isDefault: 1}, {$set: {isDefault: 0}}, {multi:true}, function(err){
            if (err){
                return res.send(500, err)
            } else{
                setDefault();
            }
        })
    }

    var setDefault = function(){
        Address.findByIdAndUpdate(addressId, {$set: {isDefault: 1}}, function(err){
            if (err){
                return res.send(500, err)
            } else{
                return res.send(200)
            }
        })
    }
    resetDefault()
}

exports.gotoAddress = function(req, res){
    var uid = req.param('uid')
    var options = {}
    if (uid){
        options.uid = uid
        options.orderId = uid
    }
    res.render('address', options)
}

exports.query = function(req, res){
    exports.getAddressByOpenId(req.openId, function(err, addresses){
        if (err){
            res.send(500)
        } else{
            res.send(addresses);
        }
    })
}

exports.getAddressByIds = function(addressIds, callback){
    var condition = {
        _id: {
            $in: addressIds
        }
    }
    Address.find(condition, callback);
}

exports.getAddressByOpenId = function(openId, callback){
    var condition = {
        openId: openId,
        deleted: {$ne: 1}
    }
    Address.find(condition, callback);
}

exports.midAddressLoader = function(req, res, next){
    var id = req.param('addressId');
    if (!id){
        return res.send(400);
    }
    Address.findById(id, function(err, doc){
        if (err){
            return res.send(500, err);
        }
        if (!doc){
            return res.send(500);
        }
        req.address = ut.doc2Object(doc);
        next();
    })
}

exports.updateAddress = function(req, res){
    var address = req.address;
    var openId = req.openId;
    if (!openId){
        return res.send(400, 'openId不存在')
    }

    if (!req.param('name')){
        return res.send(400, 'name不存在')
    }
    if (!req.param('tel')){
        return res.send(400, 'tel不存在')
    }

    if (!req.param('add')){
        return res.send(400, 'add不存在')
    }
    if (address.openId != openId){
        return res.send(400, '地址跟用户不匹配');
    }
    var orderId = ''
    if (req.param('orderId')){
        orderId =  req.param('orderId');
    }

    var addInfo = {
        name: req.param('name'),
        tel: req.param('tel'),
        province: req.param('province') || '',
        city: req.param('city') || '',
        add: req.param('add'),
        zip: req.param('zip')
    }

    var doc = {
        addInfo: addInfo
    }

    var UPDATE_SPEC = {
        $set: doc
    }
    if (orderId){
        UPDATE_SPEC.$addToSet = {ids: orderId}
    }

    Address.findByIdAndUpdate(address._id, UPDATE_SPEC, function(err){
        if (err){
            return res.send(500, err);
        } else{
            return res.send(200);
        }
    })
}

exports.addOrderToAddress = function(address, orderId){
    var UPDATE_SPEC = {
        $addToSet: {ids: orderId}
    }
    Address.findByIdAndUpdate(address._id, UPDATE_SPEC, function(err){
        if (err){
            return console.log(err);
        } else{
            return;
        }
    })
}

exports.deleteAddress = function(req, res){
    var address = req.address;
    var openId = req.openId;
    if (!openId){
        return res.send(400, 'openId不存在')
    }
    if (address.openId != openId){
        return res.send(400, '地址跟用户不匹配');
    }

    Address.findByIdAndUpdate(address._id, {$set: {deleted: 1}}, function(err, doc){
        if (err){
            return res.send(500, err);
        } else{
            return res.send(200);
        }
    })
}

//----------------------------------------------
exports.write = function(req,res){
    var openId = req.session.openId;
    var orderId = req.session.orderId;
    console.log('----------------',openId);
    if (!openId){
        return res.send(400, 'openId不存在')
    }
    if (!orderId){
        return res.send(400, 'orderId 不存在')
    }
    res.render('address', {
        openId: openId,
        uid:orderId,
        orderId:orderId,
        tips: 1
    });
};

exports.authOrderId = function(req,res,next){
    var orderId = req.param('orderId');
    if (!orderId){
        return res.send(400, 'orderId 不存在')
    }else{
        req.session.orderId = orderId;
        next();
    }
};


exports.reselect = function(req,res){
    var addressId = req.param('addressId');
    var orderId = req.param('orderId');
    var openId = req.session.openId;
    if (!addressId){
        return res.send(400, 'addressId 不存在')
    }
    if (!orderId){
        return res.send(400, 'orderId 不存在')
    }
    Address.update({openId: openId}, {$pull:{ids: orderId}},{multi:true}, function(err,doc){
        if (err){
            return res.send(500, err)
        } else{
            Address.findByIdAndUpdate(addressId, {$addToSet:{ids:orderId}}, function(err, doc){
                if (err){
                    return res.send(500, err);
                } else{
                    return res.send(200);
                }
            })
        }
    });
};

exports.getAddress = function(req,res) {
    var token = req.param('token');
    var openId = req.param('openId');
    var orderId = req.param('orderId');

    if (!token){
        return res.send(400, 'wxToken 不存在')
    }
    if (!openId){
        return res.send(400, 'openId 不存在')
    }
    if (!orderId){
        return res.send(400, 'orderId 不存在')
    }

    Address.findOne({token:token,openId:openId,ids:orderId},function(err,doc){
        if (err){
            return res.send(500, err);
        } else{
            if(doc && doc.addInfo){
                res.send({status: 'success',data:doc.addInfo});
            }else{
                res.send({status: 'failed', data:{}});
            }
        }
    });
};

exports.list = function(req,res) {
    var token = req.param('token');
    var orderId = req.param('orderId');
    var name = req.param('name') || '中奖名单地址列表';

    if (!token){
        return res.send(400, 'token 不存在')
    }
    if (!orderId){
        return res.send(400, 'orderId 不存在')
    }

    Address.find({token:token,ids:orderId},function(err,docs){
        if (err){
            return res.send(500, err);
        } else{
            if(docs){
                var dataArray = [];
                var ids = _.pluck(docs, 'openId');
                findUserByIds(ids,function(users){
                    _.each(docs, function (doc) {
                        var nickName = '';
                        var headImg = userHost + '/data/user_info/default.png';
                        var _id = '';
                        if (users && users[doc.openId]) {
                            nickName = users[doc.openId].nickName;
                            headImg = users[doc.openId].headImg;
                            _id=  users[doc.openId]._id;
                        }else{
                            _id = token+'_'+doc.openId;
                        }
                        dataArray.push({
                            nickName:nickName,
                            headImg:headImg,
                            _id:_id,
                            addInfo:doc.addInfo
                        });
                    });
//                    res.render('winners',{
//                        layout: false,
//                        winners: dataArray
//                    });
                    orderDownloadResponse(res,dataArray,name);
                });
            }else{
                res.send({status: 'failed', data:{}});
            }
        }
    });
};

var findUserByIds = function (openIds, callback) {
    var condition = {
        openId: {$in: openIds}
    };
    Users.find(condition,{_id:1,nickName:1,headImg:1,openId:1}, function (err, docs) {
        if (err) {
            console.log(err);
            return callback({});
        }
        if (!docs || docs.length == 0) {
            return callback({});
        }
        var friendMap = {};
        _.each(docs, function (doc) {
            friendMap[doc.openId] = doc;
        });
        callback(friendMap);
    })
};

function orderDownloadResponse(res, docs,name){
    var conf ={};
    conf.cols = [{
        caption:'微信昵称',
        type:'string',
        width: 30
    },{
        caption:'获奖者姓名',
        type:'string',
        width: 30
    },{
        caption:'联系电话',
        type:'string',
        width: 20
    },{
        caption:'联系地址',
        type:'string',
        width: 100
    },{
        caption:'邮编',
        type:'string',
        width: 20
    }];
    conf.rows = [];

    _.each(docs,function(o) {
        var row = []
        row.push(o.nickName);
        row.push(o.addInfo.name);
        row.push(o.addInfo.tel);
        row.push(o.addInfo.add);
        if(o.addInfo.zip){
            row.push(o.addInfo.zip);
        }else{
            row.push('');
        }
        conf.rows.push(row);
    });
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(name) + '.xlsx');
    res.end(result, 'binary');
}

exports.queryDefault = function(req, res){
    Address.findOne({token: req.token, openId:req.openId, isDefault: 1, deleted: {$ne: 1}}, {}, {sort: {dateTime: -1}}, function(err,doc){
        if (err){
            return res.send(500, err);
        } else{
            if (!doc){
                res.send({})
            } else {
                res.send(doc)
            }
        }
    });
}

exports.fillAddress = function(req, res, next){
    var address = req.body.address
    console.log(address)
    if (address.name && address.tel){
        exports.saveAddress(req.openId, req.token, address, function(err, addInfo){
            if (err){
                res.send(500, err)
            } else {
                console.log('addInfo')
                console.log(addInfo)
                req.body.addressId = addInfo._id.toString();
                console.log(req.body.addressId)
                next()
            }
        })
    } else {
        console.log('address')
        console.log(address)
        next()
    }
}