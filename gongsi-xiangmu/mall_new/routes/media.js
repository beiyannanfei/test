/**
 * Created by luosm on 2015/6/30.
 */

var mediaApi  = require("../interface/mediaApi");
var dbUtils = require('../mongoSkin/mongoUtils.js');
var goodsCollection = new dbUtils('goods');
var _ =require("underscore");
var js2xmlparser = require("js2xmlparser");
var user = require("./user")
var lottery = require("./lottery");

exports.getMedia=function(req,res){
    var count = req.param('count');
    //page start 1
    var page = req.param('page');
    var topic = req.param('topic');
    //req.session.token="tvmcj";
    mediaApi.getMedia(count,page,topic,req.session.token,function(err,result){
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    });
};
/*
��ȡ��Ƶ��Ϣ ����xml��ʽ ����շ���Ϣ
 <charge>
 <price>54.2</price>
 <freeSecond>30</freeSecond>
 </charge>
 */
exports.getMediaApi=function(req,res){
    var count = req.param('count');
    //page start 1
    var page = req.param('page');
    var topic = req.param('topic');
    var token=req.param('token');
    //req.session.token="tvmcj";//for test
    mediaApi.getMedia(count,page,topic,token,function(err,result){
        if(err){
            res.send(err.toString());
        }else{
            getMediaXml(result,function(err,xmlresult){
                if(err){
                    res.end(err.toString());
                }else{
                    res.set('Content-Type', 'text/xml');
                    res.end(xmlresult);
                }
            });
        }
    });
}

exports.getMediaByIdApi=function(req,res){
    var token = req.param('token');
    var id=req.param('entryid');
    mediaApi.getMediaById(token,id,function(err,result){
        if(err){
            res.end(err.toString());
        }else {
            getMediaXml(result, function (err, xmlresult) {
                if (err) {
                    res.end(err.toString());
                } else {
                    res.set('Content-Type', 'text/xml');
                    res.end(xmlresult);
                }
            });
        }
    });
};

exports.getMediawxByIdApi=function(req,res){
    var token = req.session.token;
    var id=req.param('entryid');
    mediaApi.getMediaById(token,id,function(err,result){
        if(err){
            res.send(err);
        }else {
            getMediaJson(result, function (err, jsonresult) {
                if (err) {
                    res.send(err);
                } else {
                    res.set('Content-Type', 'application/json;utf-8');
                    res.send(jsonresult);
                }
            });
        }
    });
};
/*
* ����user token �� ר��id �жϵ�ǰ�û��Ƿ���Թۿ�ĳ��Ƶ �����vip��ʾ�ɹۿ�
* �����Ƿ���Թۿ�
* */
exports.MediaCheck=function(req,res){
    var token = req.param('token');
    var userid = req.param('userid');
    var entryid = req.param('entryid').toString();
    //����ǵ㲥vip ����true ��ʾ�ɲ���
    user.checkDemandVip(token,userid,function(result){
        if(result){
            console.log("demand vip")
            res.send(result);
        }else{
            var goodsIds="";
            goodsCollection.find({"ext.videoRes.shareId":entryid},{"_id":1},
                function(err,db_result){
                    goodsIds=db_result._id;
                    //�Ƿ����
                    var condition = {
                        token: token,
                        openId: userid,
                        state: {$ne: 'deleted'},
                        prizeId: {$in: goodsIds}
                    }
                    lottery.findOrder(condition,function(orderResult){
                        if(orderResult==true){
                            res.end(orderResult);
                        }else{
                            console.log("buy link")
                            res.end("buy link");//buy url
                        }
                    })
                });
        }
    });

}


function getMediaXml(result,cb){
    getMediaJson(result,function(err,r){
        if(err){
            cb(err,null);
        }else{
            cb(null,js2xmlparser("root", r,{attributeString:"attrkey" }));
        }
    })
}

function getMediaJson(result,cb){
    var ids=[];
    if(!result.subject){
        cb("no subject",null);
        return;
    }
    //result.subject ��ֻ��һ�����ݵ������ �ᶪʧattrkey���� ��������
    if(!_.isArray(result.subject)){
        result.subject=[result.subject];
    }
    //console.log(result);
    _.each(result.subject,function(entryattr){
        //console.log(entryattr);
        ids.push(entryattr.attrkey.id);
    });

    goodsCollection.find({"ext.videoRes.shareId":{"$in":ids}},
        {"price":1,"ext.videoRes.freeSecond":1,"ext.videoRes.shareId":1,"_id":0}
        ,function(err, db_result){
            if(err){
                cb(err,null);
                console.log(err);
            }
            _.each(db_result,function(meidaObj){
                var needChargMedia=_.find(result.subject,function(m){
                    return m.attrkey.id == meidaObj.ext.videoRes.shareId;
                })
                var charg={};
                charg.price=meidaObj.price;
                charg.freeSecond=meidaObj.ext.videoRes.freeSecond;
                needChargMedia.charge=charg;
            });
            //res.set('Content-Type', 'text/xml');
            //res.send(js2xmlparser("root", result,{attributeString:"attrkey" }));
            cb(null, result);
        });
}