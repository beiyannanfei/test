/**
 * Created by chenjie on 2015/5/13.
 */


var httpUtils = require('./http-utils.js')
var config = require('../config.js')

exports.getYaoAccessToken = function(yyyappid, cb){
    var url = config.yaoHost + '/api/yaotv/auth?yyyappid=' + yyyappid + '&action=getAccessToken';
    httpUtils.httpGet(url, function(err, response){
        if (err){
            cb(err)
        } else if (response && response.access_token){
            cb(null, response.access_token)
        } else {
            cb('unknow')
        }
    })
}