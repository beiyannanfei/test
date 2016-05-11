/**
 * Created by wyq on 2015/9/18.
 */
var httpUtils = require('./httpRequest.js');

var param = {"aaa": 123, "bbb": 456};

httpUtils.httpPost("http://localhost:6600/admin/posttest", param, function(err){
    console.log(arguments)
});