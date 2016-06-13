/**
 * Created by chenjie on 2015/5/13.
 */


var httpUtils = require('./http-utils.js')
var config = require('../config.js')


exports.checkBussiness = function(tvmId, cb){
    var url = config.bussinessDomain + '/Index/checkBussiness/tvmId/' + tvmId;
    httpUtils.httpGet(url, cb)
}