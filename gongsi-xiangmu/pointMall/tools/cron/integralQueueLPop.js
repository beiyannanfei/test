/**
 * Created by chenjie on 2015/7/5.
 */

var _ = require('underscore');
var models      = require('../../models/index');
var Users    = models.Users;
var IntegralLog = models.IntegralLog;
var tools       = require('../../tools');
var queueClient = tools.queueRedisClient();

var wxInfo = require('../../routes/wxInfo.js');
var config = require('../../config.js');

process.on('uncaughtException', function (err) {
    console.log('[Inside \'uncaughtException\' event]' + err.stack || err.message);

    wxInfo.pushErrorMsg('env: ' + config.NODE_ENV + '\n' + err + '\n' + err.stack)
});

function pop(){
    queueClient.BLPOP('integralQueueData', 0, function(err, data){
        console.log(arguments)
        if (data && _.isArray(data) && data.length > 1){
            var doc = JSON.parse(data[1]);
            console.log(doc)

            if (doc.queueDataCollection){
                var cloName = doc.queueDataCollection
                delete doc.queueDataCollection

                if (doc.updateAction){
                    /*if (doc.updateAction.spec && doc.updateAction.spec._id.substring(0, 5) == 'tvmcj'){
                        return pop()
                    }*/

                    models[cloName].findOneAndUpdate(doc.updateAction.spec, doc.updateAction.updateSpec, function(err){
                        if(err) {
                            console.log('update: ' + cloName + '日志fail');
                            queueClient.lpush('errQueueData', data[1])
                        } else {
                            console.log('update: ' + cloName + '日志success');
                        }
                        pop()
                    })
                } else {
                    new models[cloName](doc).save(function(err){
                        if(err) {
                            console.log('添加' + cloName + '日志fail');
                            queueClient.lpush('errQueueData', data[1])
                        } else {
                            console.log('添加' + cloName + '日志success');
                        }
                        pop()
                    })
                }
            } else {
                pop()
            }
        } else {
            pop()
        }
    })
}
pop()

