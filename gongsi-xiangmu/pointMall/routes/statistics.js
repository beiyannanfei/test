/**
 * Created by chenjie on 2014/9/19.
 */

/*var logger = require('fluent-logger');
logger.configure('mongo.test', {host: 'localhost', port: 24224});

exports.sendLog = function(doc){
    logger.emit('follow', {log: doc, type: 'info'});
}*/

var config = require('../config.js');
var tokenConfig = require('../tokenConfig').CONFIG;

exports.getUrl = function(req, res){
    var TCONFIG = tokenConfig[req.session.token];
    var statisticsUrl = ''
    if (TCONFIG && TCONFIG.statisticsUrl && config.NODE_ENV == 'prod'){
        statisticsUrl = TCONFIG.statisticsUrl
        res.redirect(statisticsUrl);
    } else {
        res.send({});
    }
}


