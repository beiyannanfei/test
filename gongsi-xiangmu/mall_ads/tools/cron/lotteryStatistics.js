/**
 * Created by yanqiangWang on 2015/7/29.
 *
 * 根据订单信息上报摇一摇抽奖统计
 */

var _           = require('underscore');
var tools       = require('../../tools');
var redisClient = tools.redisClient();
var typeConfig  = require('../../routes/typeConfig.js');
var config      = require('../../config.js');
var httpUtils   = require('../../interface/http-utils.js');
var MD5         = require("crypto-js/md5");

process.on('uncaughtException', function (err) {
    console.log("[%j]: file: %j * uncaughtException * err: %j", new Date().toLocaleString(), __filename, err);
    lotteryStatistics();
});

var lotteryStatistics = function () {
    console.log('lotteryStatistics start****');
    var key = "yyylotterystatistics";   //摇一摇抽奖统计key
    redisClient.BRPOP(key, 0, function (err, data) {
        console.log("arguments: %j", JSON.stringify(arguments));
        if (!!err) {
            console.error("brpop yyylotterystatistics err: %j", err);
            return lotteryStatistics();
        }
        var order;
        if (data && _.isArray(data) && data.length > 1) {
            order = JSON.parse(data[1]);
        }
        if (!order) {
            return lotteryStatistics();
        }
        //开始配装需要访问上报的域名
        var url        = config.anaHost + '/ana';           //  string  固定上报域名
        var id         = '?id=555eacab75188098ad000001';    //	string	555eacab75188098ad000001
        var token      = '&token=354e6b14b65b79ad';         //	string	频道(cctv财经,btv体育....)ID
        var channel_id = '&channel_id=1782';                //	string	频道ID
        var master_id  = '&master_id=';                     //	string	广告主ID
        var event_code = '&event_code=117000';              //	string	事件编码 抽奖:117000
        var open_id    = '&open_id=';                       //	string	用户ID
        var user_name  = '&user_name=';                     //	string	用户名
        var sex        = '&sex=';                           //	int	    用户性别 (1男,2女,0未知)
        var page       = '&page=系统抽奖';                   //	string	抽奖类别(如:系统抽奖,疯狂抽奖等)
        var title_id   = '&title_id=';                      //	string	抽奖时段实例ID(如:10分钟或疯抢的时间段对应时间点的时间戳,如:1438035190000)
        var title      = '&title=抽奖页';                    //	string	页面名称,如:抽奖页
        var content_id = '&content_id=';                    //	string	奖品等级(如:一等奖,二等奖，三等奖等等)
        var content    = '&content=';                       //	string	品牌名称 目前同master_id值
        var album_id   = '&album_id=';                      //	string	奖品类型(红包,电子卡劵,实物等等)
        var album_name = '&album_name=';                    //	string	奖品名称,如:一元红包,去哪网卡劵等等
        var result     = '&result=1';                       //	string	未中奖返回0,中奖返回1
        var spend      = '&spend=';                         //	string	金额,如果奖品为现金奖则返回中奖金额如:5,10,100,非现金奖返回0
        var ip         = '&ip=';                            //	string	用户的ip地址
        var create_time = '&create_time=';                  //

        if (!order.createTime) {
            console.error("lotteryStatistics createTime is undefine");
            return lotteryStatistics();
        }
        master_id  += MD5(order.tvmId || "undefined").toString();
        open_id    += order.user.openId || "undefined";
        user_name  += order.user.name || "undefined";
        sex        += order.user.sex || 0;
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
        ip         += order.user.realIp || "undefined";
        create_time += parseInt(new Date(order.createTime || 0).getTime()/1000);

        url += id += token += channel_id += master_id += event_code += open_id += user_name += sex += page += title_id;
        url += title += content_id += content += album_id += album_name += result += spend += ip += create_time;
        console.log("url = %j", url);
        report(url);
        setTimeout(lotteryStatistics, 50);
    });
};

var report = function (url, tryTime) {
    if (!tryTime){
        tryTime = 0;
    }
    try {
        httpUtils.httpGetTimeout(url, function (err, response) {
            if (err == 'httpError'){
                if (tryTime < 3){
                    tryTime++;
                    console.log("repeat report times: %j,url: %j", tryTime, url);
                    return report(url, tryTime)
                }
                else {
                    console.log("get url:%j 3 times err", url);
                    return redisClient.lpush("yyylotterystatisticsurl", url);
                }
            }
        });
    }
    catch (e) {
        console.error("httpGet error: %j", e);
    }
};

lotteryStatistics();
