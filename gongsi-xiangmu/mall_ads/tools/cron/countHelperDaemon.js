/**
 * Created by chenjie on 2015/1/8.
 */
var wxInfo = require('../../interface/wxInfo.js');
var config = require('../../config.js');

process.on('uncaughtException', function (err) {
    console.log('[Inside \'uncaughtException\' event]' + err.stack || err.message);
    wxInfo.pushErrorMsg('env: ' + config.NODE_ENV + '\n' + err + '\n' + err.stack)
});

require('./countOrder.js');
//require('./countCrazyOrder.js');
require('./lotteryStatistics.js');

