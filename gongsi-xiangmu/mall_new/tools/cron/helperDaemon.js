/**
 * Created by chenjie on 2015/1/8.
 */

require('./wxOrderQuery.js')
require('./lotteryStatistics.js')

process.on('uncaughtException', function (err) {
    console.log('[Inside \'uncaughtException\' event]' + err.stack || err.message);
});

