/**
 * Created by luosm on 2015/7/3.
 * 创建系统抽奖
 *
 */

var _                        = require('underscore');
var ut                       = require('./utils')
var dbUtils                  = require('../mongoSkin/mongoUtils.js');
var typeConfig               = require('./typeConfig.js');
var sysLotteriesCollection   = new dbUtils('syslotteries');
var dbUtils                  = require('../mongoSkin/mongoUtils.js');
var prizeCollection          = new dbUtils('prize');
var ObjectID                 = require('mongodb').ObjectID;


function checkSysLotteryParam(req, cb){
    var lottery = req.body.lottery

    if (!lottery){
        return cb('param lottery is required ')
    }
    var prizes = lottery.prizes;
    if(prizes){
        if (!prizes || !_.isArray(prizes) || prizes.length == 0){
            return cb('param prizes error')
        }
        var count = 0
        for (var i = 0; i < prizes.length; i++){
            var o = prizes[i]
            if (!o.id){
                return cb('param prizes error, id is not exists')
            }
            o.count = ut.checkPositiveInt(o.count)
            if (o.count == null){
                return cb('param prizes error, count error')
            }
            count += o.count

            o.rate = ut.checkPositiveInt(o.rate)
            if (o.rate == null){
                return cb('param prizes error, rate error')
            }
        }
        lottery.type = typeConfig.sysLotteryType.common;
        lottery.count = count
        cb(null, lottery);
    }
    var money = lottery.money;
    if(money){
        var count = 0;
        for (var i = 0; i < money.info.length; i++){
            var o = money.info[i];
            //原来是人数  现在代表人数占比
            o.count = ut.checkPositiveFloat(o.count);
            if (o.count == null){
                return cb('param prizes error, count error')
            }
            count += o.count;
            o.percent = ut.checkPositiveFloat(o.percent)
            if (o.rate == null){
                return cb('param prizes error, percent error')
            }
        }
        lottery.count = count;
        lottery.type = typeConfig.sysLotteryType.money;
        cb(null, lottery);
    }
}

/*
* 创建系统抽奖
* 创建时间  createtime: new Date()
* 奖品        prizes  : [ {id:abc,rate:1,count:15} ]
* 创建者     tvmid    : afasdfew
* 中奖总个数  count   : 由奖品中的count相加得到
* */
exports.createLottery = function(req,res){
    checkSysLotteryParam(req, function(err, doc){
        if (err){
            return res.send(400, err);
        }

        doc.dateTime = (new Date()).getTime();
        ut.groupDoc(doc, req);
        delete doc._id; //防止前端传递_id ;
        sysLotteriesCollection.save(doc, function(err, o){
            if (err){
                return res.send(500, err);
            }
            return res.send(200, o);
        })
    })

}

exports.updateLottery=function(req,res){
    checkSysLotteryParam(req, function(err, doc){
        if (err){
            return res.send(400, err);
        }
        var lotteryId=req.body.id;
        if(!lotteryId){
            return res.send("param id is required");
        }
        var lotteryType=req.body.type;
        if(lotteryType==undefined){
            return res.send("param type is required");
        }

        sysLotteriesCollection.findById(lotteryId,function(err,lotteryDoc){
            if(err){
                return res.send(500,"not found lottery"+err);
            }
            if(!lotteryDoc){
                return res.send(404,"not found lottery by id "+ lotteryId);
            }
            var del="";
            if(lotteryType==typeConfig.sysLotteryType.common){//prize
                delete lotteryDoc.money;
                del={"money":1};
                lotteryDoc.type=0;
                lotteryDoc.prizes=doc.prizes;
            }else if(lotteryType==typeConfig.sysLotteryType.money){ //money
                delete lotteryDoc.prizes;
                del={"prizes":1};
                lotteryDoc.type=1;
                lotteryDoc.money=doc.money;
            }
            delete lotteryDoc._id;
            console.log("sysLotteriesCollection.findById")

            sysLotteriesCollection.updateById(lotteryId,{"$unset":del}, function(err, o){
               if(err){
                   return res.send(500, err);
               }
                sysLotteriesCollection.updateById(lotteryId,{"$set":lotteryDoc}, function(err, o){
                    if (err){
                        return res.send(500, err);
                    }
                    console.log("sysLotteriesCollection.updateById")
                    return res.send(200, o);
                })
            })
        });
    })
}


/*
* 根据一个lotteryid 修改其他的lottery 信息
* */
exports.updateMultiLottery=function(req,res){
    var lotteryId=req.body.id;
    if(!lotteryId){
        return res.send("param id is required");
    }
    var copyIds= req.body.copyIds;
    console.log("copyIds"+typeof copyIds);
    console.log("copyIds"+copyIds);
    if (!copyIds){
        return res.send(400, 'copyIds err')
    }
    copyIds = copyIds.split(',');
    var allValid=true;
    var updateas=[];
    _.each(copyIds,function(id){
        if(!ObjectID.isValid(id)){
            updateas.push(id);
            allValid=false;
        }
    })
    if(!allValid){
        return res.send(500, 'ids not valided '+(updateas));
    }
    console.log(copyIds)
    if (copyIds.length == 0){
        return res.send(400, 'copyIds err')
    }
    sysLotteriesCollection.findById(lotteryId,function(err,lotteryDoc){
        if(err){
            return res.send("findById "+lotteryId+" err "+err);
        }
        if(!lotteryDoc){
            return res.send(404,"not found system lottery by id "+ lotteryId);
        }else{
            //req.sysLottery=lotteryDoc;
            delete lotteryDoc._id
            sysLotteriesCollection.update({_id: {$in: dbUtils.toId(copyIds)}}, {$set: lotteryDoc}, {multi: true}, function(err, docs){
                if (err){
                    console.log(err);
                    return res.send(500, 'mongodb error!'+err)
                } else {
                    return res.send(200,docs)
                }
            })
        }
    });


}

/*
* 根据id 获取系统抽奖详细信息
* */
exports.getOneLottery=function(req,res){
    var lotteryid=req.param("lotteryid");
    if(!lotteryid){
        return res.send("param id is required");
    }
    sysLotteriesCollection.findById(lotteryid,function(err,lotteryDoc){
        if(err){
            return res.send(500, err);
        }
        if(lotteryDoc){
            var prizeids=[];
            if(lotteryDoc.prizes || lotteryDoc.type==typeConfig.sysLotteryType.common){
                _.each(lotteryDoc.prizes,function(prize){
                    prizeids.push(new ObjectID(prize.id));
                });
                prizeCollection.find({"_id":{"$in":prizeids}},function(err,doc){
                    if(err){
                        return res.send("find ids err"+err);
                    }
                    if(!doc){
                        return res.send("not found doc");
                    }
                    _.each(lotteryDoc.prizes,function(prize){
                        var fpri=_.find(doc,function(pri){return pri._id=prize.id});
                        prize.name=fpri.name;
                        prize.pic=fpri.pic;
                        prize.type=fpri.type;
                    });
                    if(err){
                        return res.send(500, err);
                    }else{
                        return res.send(200, lotteryDoc);
                    }
                });
            }
            else if(lotteryDoc.money || lotteryDoc.type==typeConfig.sysLotteryType.money){
                if(lotteryDoc.money.prizes){
                    console.log("aaaaaaaaaaaaa");
                    _.each(lotteryDoc.money.prizes,function(prize){
                        prizeids.push(new ObjectID(prize.id));
                    });
                    prizeCollection.find({"_id":{"$in":prizeids}},function(err,doc){
                        if(err){
                            return res.send("find ids err"+err);
                        }
                        if(!doc){
                            return res.send("not found doc");
                        }
                        _.each(lotteryDoc.money.prizes,function(prize){
                            var fpri=_.find(doc,function(pri){return pri._id=prize.id});
                            prize.name=fpri.name;
                            prize.pic=fpri.pic;
                            prize.type=fpri.type;
                        });
                        return res.send(200, lotteryDoc);
                    });
                }else{
                    return res.send(200, lotteryDoc);
                }

            }
        }else{
            return res.send(500,"not found lottery");
        }
    })
}


exports.copyLottery=function(req,res){
    var lotteryid=req.param("lotteryid");
    if(!lotteryid){
        return res.send("param id is required");
    }

    if(!req.param("count")){
        return res.send("param count is required");
    }

    var count=parseInt(req.param("count"));

    sysLotteriesCollection.findById(lotteryid,function(err,lotteryDoc){
        if(err){
            return  res.send(400,err);
        }
        if(lotteryDoc){
            lotteryDocs=[];
            for(var i=0;i<count;i++){
                delete lotteryDoc._id;
                lotteryDoc=_.extend({},lotteryDoc)
                lotteryDocs.push(lotteryDoc);
            }
            sysLotteriesCollection.insert(lotteryDocs,function(err,doc){
                if(err){
                    return  res.send(400,err);
                }
                res.send(200,_.pluck(doc, '_id'));
            })
        }else{
            res.send(400,"未根据lotteryid找到系统抽奖信息");
        }

    });

}

/*
* check lotteryid 是否存在
* */
exports.midSysLotteryLoader=function(req,res,next){
    var lotteryId=req.param("lotteryid");
    if(!lotteryId){
        return res.send("param lotteryid is required");
    }
    sysLotteriesCollection.findById(lotteryId,function(err,lotteryDoc){
        if(err){
            return res.send("param lotteryid is required");
        }
        if(!lotteryDoc){
            return res.send(404,"not found system lottery by id "+ lotteryId);
        }else{
            req.sysLottery=lotteryDoc;
            next();
        }
    });
}


/*
* 根据id查询系统抽奖数据是否存在
* */
exports.getSysLotteryInfo=function(lotteryid,cb){
    sysLotteriesCollection.findById(lotteryid,function(err,doc){
        if (err){
            return cb(err);
        }
       return cb(null,doc);
    });
}

//console.log(ObjectID.isValid("aaaaaaaaaaaaaaaaaaaaaaaa"));