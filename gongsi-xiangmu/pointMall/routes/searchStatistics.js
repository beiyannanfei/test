/**
 * Created by zwb on 2014/12/5.
 */

var moment = require('moment');
var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var request = require('superagent');
var _ = require('underscore');
var config = require('../config.js');
var searchUrl = config.searchUrl;
var h5Url = config.h5Url;

var interface = require('../interface');

exports.index = function (req, res) {
    var _today = moment(new Date()).format('YYYY-MM-DD');
    var today = [];
    var week = [];
    var month = [];
    getStatistics(_today,function(data){
        if(data && data.response == 'SUCCESS'){
            var dataArray = data.hit;
            var dayArray  = [];
            var weekArray  = [];
            var monthArray  = [];
            _.each(dataArray, function (array) {
//                console.log(array.$.SetName,array.Keywords.top10);
                if(array.$ && array.$.SetName && array.$.SetName=='Day'){
                    dayArray = array.Keywords.top20 || array.Keywords.top10;
                }else if(array.$ && array.$.SetName && array.$.SetName=='Week'){
                    weekArray = array.Keywords.top20 || array.Keywords.top10;
                }else if(array.$ && array.$.SetName && array.$.SetName=='Month'){
                    monthArray = array.Keywords.top20 || array.Keywords.top10;
                }
            });
            var i=1, j=1,k=1;
            _.each(dayArray, function (array) {
                //console.log('dayArray',array);
                var _heat = true;
                if(i>3){
                    _heat = false;
                }
                today.push({
                    id:i,
                    keyword:array.$.keywords,
                    heat:_heat,
                    hits:array._,
                    href:h5Url+'/h5/sousuo.htm?keyword='+array.$.keywords+'&wxToken=3a59f7a4b8b28dca'
                });
                i++;
            });
            _.each(weekArray, function (array) {
                //console.log('weekArray',array);
                var _heat = true;
                if(j>3){
                    _heat = false;
                }
                week.push({
                    id:j,
                    keyword:array.$.keywords,
                    heat:_heat,
                    hits:array._,
                    href:h5Url+'/h5/sousuo.htm?keyword='+array.$.keywords+'&wxToken=3a59f7a4b8b28dca'
                });
                j++;
            });
            _.each(monthArray, function (array) {
                //console.log('monthArray',array);
                var _heat = true;
                if(k>3){
                    _heat = false;
                }
                month.push({
                    id:k,
                    keyword:array.$.keywords,
                    heat:_heat,
                    hits:array._,
                    href:h5Url+'/h5/sousuo.htm?keyword='+array.$.keywords+'&wxToken=3a59f7a4b8b28dca'
                });
                k++;
            });
        }
        res.render('searchStatistics', {
            layout: false,
            today: today,
            week:week,
            month:month
        });
    });
};

var getStatistics = function(today,callback){
    var url = searchUrl+'/sstj.jsp?d='+today;
    interface.getUrlData(url,function(content){
        if (content) {
            parseString(content, {explicitArray: false, trim: true, explicitRoot: false}, function (err, result) {
                if (err) {
                    console.log('---解析XML报错，不是合法的xml---搜索统计', err);
                    callback(null);
                } else {
                    if (result && result != 'undefined') {
                        callback(result);
                    } else {
                        callback(null);
                    }
                }
            });
        } else {
            console.log('---解析XML报错，不是合法的xml--- 搜索统计',url,content);
            callback(null);
        }
    });
}