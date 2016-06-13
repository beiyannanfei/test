/**
 * Created by chenjie on 2014/10/11.
 */

var async = require('async');
var _ = require('underscore');

var models = require('../models')
var Notice = models.Notice;

exports.addNotice = function(docs){
    if (!_.isArray(docs)){
        docs = [docs];
    }

    async.eachSeries(docs, function(doc, callback){
        if (!doc.token){
            return callback('no token');
        }
        if (!doc.openIds){
            return callback('no message');
        }

        new Notice(doc).save(function(err){
            callback(err);
        })
    }, function(err){
        if (err){
            console.log(err);
        }
    })
}
