/**
 * Created by nice on 2014/9/17.
 */



var tools = require('../tools');
var interface = require('../interface');


var models = require('../models/index');
var Users = models.Users;

var utils = require('../routes/utils');

var _ = require('underscore');



var reacquire = function(){
    Users.find({nickName:'Gest',headImg:'http://mb.tv.tvmining.com/data/user_info/default.png'},function(err,docs){
        if(err){
            console.log(err);
        }else{
            if(docs){
                _.each(docs, function (doc) {
                   var openId = doc.openId;
                   var wxToken = doc.wxToken;
                    var _id = doc._id;
                    interface.getUserInfo(openId,wxToken,function(data){
                        console.log('--------------------------- id ------------------------',_id);
                       if(data){
                           var userObj = data.data.data;
                           if(userObj){
                               console.log('====================================',userObj);
                               console.log(openId,wxToken);
                               var nickName = userObj.username;
                               var headImg = userObj.weixin_avatar_url;
                               Users.findByIdAndUpdate(_id,{$set:{nickName:nickName,headImg:headImg}},function(err,info){
                                   if(err){
                                       console.log(err);
                                   }else{
                                       console.log(info);
                                   }
                               });
                           }
                       }
                    });



                });
            }
        }
    });
};


reacquire();