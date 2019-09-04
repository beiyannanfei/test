/**
 * Created by userName.Wang on 2015/7/30.
 * 将数据库中的数据解析并上报到http
 */
var dbUtils          = require('../mongoSkin/mongoUtils.js');
var ordersCollection = new dbUtils('order');
var async            = require('async');
var _                = require("underscore");
var tools            = require('../tools');
var typeConfig       = require('../routes/typeConfig.js');
var httpUtils        = require('../interface/http-utils.js');
var MD5              = require("crypto-js/md5");
var config           = require('../config.js');

var index = 0;
var readFlag = true;
var preReadCount = 1000;  //每次从数据库中读取的数据条数
console.time("read data use time");
async.whilst(
    function () {
        return readFlag;
    },
    function (cb) {
        ordersCollection.findNoCache({},{},{skip: index * preReadCount, limit: preReadCount}, function(err, datas) {
            ++index;
            if (datas.length <= 0) {
                readFlag = false;
                console.timeEnd("read data use time");
                console.log("*********数据读取完毕");
                return cb("no data");
            }
            console.log("*********%j read data index: %j", new Date().toLocaleString(), index);
            distributionData(datas);
            cb(err);
        })
    },
    function (err) {
        console.log('err: ', err);
    }
);

var distributionData = function (datas) {
    for (var index in datas) {
        var data = datas[index];
        lotteryStatistics(data);
    }
};

var lotteryStatistics = function (order) {
        //开始配装需要访问上报的域名
        var url        = config.anaHost + '/ana';           //  string  固定上报域名
        var id         = '?id=555eacab75188098ad000001';    //	string	555eacab75188098ad000001
        var token      = '&token=354e6b14b65b79ad';         //	string	频道(cctv财经,btv体育....)ID
        var channel_id = '&channel_id=1782';                //	string	频道ID
        var master_id  = '&master_id=';                     //	string	广告主ID
        var event_code = '&event_code=117000';              //	string	事件编码 抽奖:117000
        var open_id    = '&open_id=';                       //	string	用户ID
        var user_name  = '&user_name=';                     //	string	用户名
        var sex        = '&sex=0';                          //	int	用户性别 (1男,2女,0未知)
        var page       = '&page=系统抽奖';                   //	string	抽奖类别(如:系统抽奖,疯狂抽奖等)
        var title_id   = '&title_id=';                      //	string	抽奖时段实例ID(如:10分钟或疯抢的时间段对应时间点的时间戳,如:1438035190000)
        var title      = '&title=抽奖页';                    //	string	页面名称,如:抽奖页
        var content_id = '&content_id=';                    //	string	奖品等级(如:一等奖,二等奖，三等奖等等)
        var content    = '&content=';                       //	string	品牌名称 目前同master_id值
        var album_id   = '&album_id=';                      //	string	奖品类型(红包,电子卡劵,实物等等)
        var album_name = '&album_name=';                    //	string	奖品名称,如:一元红包,去哪网卡劵等等
        var result     = '&result=1';                       //	string	未中奖返回0,中奖返回1
        var spend      = '&spend=';                         //	string	金额,如果奖品为现金奖则返回中奖金额如:5,10,100,非现金奖返回0

        master_id  += MD5(order.tvmId || "undefined").toString();
        open_id    += order.user.openId || "undefined";
        user_name  += order.user.name || "undefined";
        title_id   += new Date(order.createTime || 0).getTime();
        content_id += order.prize ? order.prize.rate : (order.money ? order.money.rate : "undefined");
        content    += MD5(order.tvmId || "undefined").toString();
        var type = order.prize ? order.prize.type : (order.money ? order.money.type : 0);
        type =
            (type == 1 ? "实物" :
                (type == 2 ? "消费码" :
                    (type == 3 ? "第三方卡券" :
                        (type == 101 ? "微信卡券" :
                            (type == 102 ? "微信红包" :
                                "undefined"
                                )
                            )
                        )
                    )
                );
        album_id   += type;
        album_name += order.prize ? order.prize.name : (order.money ? order.money.name : "undefined");
        spend      += order.money ? order.money.money : (order.prize ? (order.prize.type == 102 ? order.prize.money : 0) : 0);

        url += id += token += channel_id += master_id += event_code += open_id += user_name += sex += page += title_id;
        url += title += content_id += content += album_id += album_name += result += spend;
        console.log("url = %j", url);
        report(url);
};

var report = function(url) {
    httpUtils.httpGet(url, function (err, response) {
        console.log('httpGet url: %j, err: %j, response: %j', url, err, JSON.stringify(response));
    });
};