var ut = require('./utils')
var config = require('../config');

exports.clearToken = function(req, res, next){
    req.token = null;
    next()
}