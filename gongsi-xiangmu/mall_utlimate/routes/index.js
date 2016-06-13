/**
 * Created by wyq on 2015/9/15.
 */
var tools = require("../tools");
var redisClient = tools.redisClient();
var querystring = require('querystring');
var parse = require('co-body');


exports.getParams = function *(next) {
    var method = this.req.method;
    var params = "";
    if (method == "GET") {
        params = querystring.parse(this.req._parsedUrl.query);  //get形式获取参数
    }
    if (method == "POST") {
        params = yield parse(this);     //post形式获取参数
    }
    this.args = params;
    yield next;
};
