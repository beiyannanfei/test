/**
 * Created by chenjie on 2015/7/5.
 */

var tools       = require('../tools');
var _                 = require("underscore");
var queueClient = tools.queueRedisClient();

//doc 中需要包含queueDataCollection:表的名字
exports.push = function(doc){
    queueClient.lpush('queueData', JSON.stringify(doc))
}

exports.pushIntegral = function(doc){
    queueClient.lpush('integralQueueData', JSON.stringify(doc))
}
