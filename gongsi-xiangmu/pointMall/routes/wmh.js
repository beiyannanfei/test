/**
 * Created by Administrator on 2015/3/17.
 */

var request = require('superagent');
var config = require('../config');
var _ = require('underscore');
var MD5 = require("crypto-js/md5");
var childProcess = require('child_process');

function httpGet(url, cb) {
    console.log(url)
    request.get(url)
        .type('application/x-www-form-urlencoded')
        .accept('text/json')
        .end(function (xhr) {
            console.log(xhr)
            if (xhr.statusCode == 200) {
                if (xhr.text) {
                    var body;
                    try {
                        body = JSON.parse(xhr.text);
                    } catch (e) {
                        body = xhr.text
                    }
                    cb(null, body);
                } else {
                    cb('response has not content');
                }
            } else {
                cb(xhr.statusCode);
            }
        });
}

function httpPost(url, params, cb) {
    var options = _.extend({}, params);
    console.log(url)
    request.post(url)
        .type('application/x-www-form-urlencoded')
        .send(options).accept('text/json')
        .end(function (xhr) {
            if (xhr.statusCode == 200) {
                if (xhr.text) {
                    var body;
                    try {
                        body = JSON.parse(xhr.text);
                    } catch (e) {
                        body = xhr.text
                    }
                    cb(null, body);
                } else {
                    cb('response has not content');
                }
            } else {
                cb(xhr.statusCode);
            }
        });
}

exports.getWmhVideoResource = function(token, cb) {
    var url = config.wmhUrl + '/rest/resource/list?token=' + token + '&limit=2000'
    httpGet(url, cb)
}

exports.getWmhVideoResourceJSON = function(md5, cb) {
    var s = md5.substring(0, 2) + '/' + md5.substring(2, 4) + '/' + md5 + '.json'
    var url = config.wmhUrl + '/data/cloud_json/' + s
    //var url = 'http://iwmh.mtq.tvm.cn' + '/data/cloud_json/' + s
    var cmdArr = ['curl', "-k", url]
    childProcess.exec(cmdArr.join(' '), function(err, response){
        console.log(arguments)
        if (err){
            cb(err)
        } else if (response){
            try {
                response = JSON.parse(response);
            } catch (e) {

            }
            cb(err, response)
        } else {
            cb('err:')
        }
    });
}
