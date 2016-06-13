/**
 * Created by zwb on 2014/12/25.
 */


var moment = require('moment');
var URL = require('url');
var xml2js = require('xml2js');

var dbUtils = require('../mongoSkin/mongoUtils.js');
var userCollection = new dbUtils('users');

var _ = require('underscore');




function integral(){
    for(var i=0 ;i<20;i++){

        var lt = i*5000;
        var gt =(i+1)*5000;
        var condition = {
            wxToken:'5f86a592f1dd5f26',
            integral:{$gt:lt,$lte:gt}
        };
        (function(condition,lt,gt,i){
            getTotal(condition,function(count){
                if(count){
                    console.log(lt,gt,count);
                }else{

                    console.log('-----------------',i);
                }
            });
        })(condition,lt,gt,i);


    }
}


var getTotal = function (condition, callback) {
    userCollection.countNoCache(condition, function (err, count) {
        if (err) {
            console.log(err);
            callback(null);
        } else {
            if (count) {
                callback(count);
            } else {
                callback(null);
            }
        }
    });
};


integral();