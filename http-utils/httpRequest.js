/**
 * Created by wyq on 2015/9/18.
 */
var request = require('superagent');

exports.httpPost = function (url, param, cb) {
    console.log(url)
    request.post(url)
        .type('application/x-www-form-urlencoded')
        .send(param)
        .accept('text/json')
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
};

exports.httpGet = function (url, cb) {
    console.log(url)
    request.get(url)
        .type('application/x-www-form-urlencoded')
        .accept('text/json')
        .end(function (xhr) {
            console.log(xhr.text)
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
};