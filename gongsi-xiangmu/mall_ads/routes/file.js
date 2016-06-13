/**
 * Created by Administrator on 2014/8/1.
 */

var mongoose = require('mongoose');
var GridStore = mongoose.mongo.GridStore
var config = require('../config');
var moment = require('moment')
var childProcess = require('child_process');
var path = require('path')
var db          = require('../mongoSkin/mongo.js');

exports.uploadFile = function(file, fn){
    if (config.NODE_ENV == 'dev'){
        var options = {metadata: {name: file.name, type: file.type, size: file.size}, root: "fs"};
        var gs = new GridStore(db, file.path, "w", options)
        gs.open(function(err, girdfs){
            console.log('fs open success');
            if (err){
                return fn(err)
            }
            girdfs.writeFile(file.path, function(err, result){
                console.log(err)
                var id = result._id || result.fileId;
                var url = config.domain + "/i/" + id;  // /i for image
                console.log(url)
                fn(null, url);
            })
        })
    } else {
        var fileName = '' + moment(new Date()).format('YYYYMMDDHHmmss') + '-' + path.basename(file.path)
        var cmdArr = ['cp ', file.path, config.fileUploadDir + '/' + fileName]
        childProcess.exec(cmdArr.join(' '), function(err){
            if (err){
                return fn(err)
            } else {
                var url = config.domain + config.nginxFileDir + '/' + fileName;
                console.log(url)
                fn(null, url);
            }
        });
    }
}

exports.getFile = function(req, res){
    var id = req.params.fileId;
    var gs = new GridStore(db, new ObjectID(id), 'r', {root: "fs"});
    gs.open(function(err, result){
        if (err){
            console.log(err);
            return res.send(404, err);
        }
        result.stream(true);
        res.set('Date', new Date().toUTCString())
        res.set('Cache-Control', 'public, max-age=' + (3600 * 24 * 30))
        res.set('Last-Modified', result.uploadDate.toUTCString())
        res.set('Content-Length', result.length)
        result.pipe(res)
    });
}

exports.delFile = function(req, res){
    var id = req.params.fileId;
    var gs = new GridStore(db, new ObjectID(id), 'w', {root: "fs"});
    gs.unlink(function(err){
        if (err){
            console.log(err);
            return res.send(500, err);
        }
        return res.send(200);
    });
}

exports.postFile = function(req, res){
    console.log('req files:',req.files);
    var file = req.files.file;
    if(file.size > 1000 * 1024){
        return res.send(400, {error: 1, msg: '文件太大，不能超过1M'});
    }
    exports.uploadFile(file, function(err, url){
        if (err){
            res.send(500, {error: 1, msg: err})
        } else {
            res.send({error: 0, url: url, name: file.name, state: 'SUCCESS'})
        }
    })
}