/**
 * Created by chenjie on 2015/4/22.
 */

var request = require('superagent');
var _ = require('underscore');
var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var jsonxml = require('jsontoxml');
var qs = require('querystring')
var https = require('https')
var parse = require('url').parse;

exports.postFile = function(url, fileName, filePath, cb){
    request.post(url)
        .type('multipart/form-data')
        .attach(fileName, filePath)
        .end(function(xhr) {
            if (xhr.statusCode == 200) {
                console.log(xhr.text)
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

exports.getXmlHttp = function(url, cb){
    request.get(url)
        .type('application/x-www-form-urlencoded')
        .end(function (xhr) {
            if (xhr.statusCode == 200){
                if (xhr.text){
                    parseString(xhr.text, {attrkey:'attrkey',explicitArray: false, trim: true, explicitRoot: false}, function(err, result){
                        cb(err, result);
                    })
                } else {
                    cb('no response');
                }
            } else {
                cb(xhr.statusCode);
            }
        });
}

exports.postXmlHttp = function(url, params, cb){
    var options = _.extend({}, params);
    var xml = jsonxml(options, {})
    xml = '<xml>' + xml + '</xml>'
    console.log(xml)
    console.log(url)
    request.post(url)
        .type('text/html')
        .send(xml)
        .end(function(xhr) {
            if (xhr.statusCode == 200){
                if (xhr.text){
                    parseString(xhr.text, {explicitArray: false, trim: true, explicitRoot: false}, function(err, result){
                        cb(err, result);
                    })
                } else {
                    cb('no response');
                }
            } else {
                cb(xhr.statusCode);
            }
        });
}

exports.postXmlHttps = function(url, wx_ssl_options, params, cb){
    var paramBody = _.extend({}, params);
    var body = jsonxml(paramBody, {})
    body = '<xml>' + body + '</xml>'
    console.log(body)

    url = parse(url, true);

    var options = {
        method: 'POST',
        key: wx_ssl_options.key,
        cert: wx_ssl_options.cert,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': body.length
    }
    options.path = url.pathname;
    options.host = url.hostname;

    var req = https.request(options, function(res) {
        var buf = ''
        res.on('data', function(chunk) {
            buf += chunk
        });

        res.on('end', function() {
            parseString(buf, {explicitArray: false, trim: true, explicitRoot: false}, function(err, result){
                cb(err, result);
            })
        });

        res.on('error', function(e) {
            console.log('res error:' + e)
            cb(e);
        });
    });

    if (body){
        req.end(body);
    } else {
        req.end();
    }

    req.on('error', function(e) {
        console.log('req error:' + e)
        cb(e);
    });
}

exports.httpPostOnlyUtf8 = function(url, param, cb) {
    console.log(url)
    request.post(url)
        .type('application/x-www-form-urlencoded')
        .set('Content-Type', 'charset=UTF-8')
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
}

exports.httpPost = function(url, param, cb) {
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
}

exports.httpPostOpenApi = function(url, param, cb) {
    request.post(url)
        .send(param)
        .buffer()
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

exports.httpGet = function(url, cb) {
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
}

exports.httpGetTimeout = function(url, cb) {
    console.log(url)
    request.get(url)
        .type('application/x-www-form-urlencoded')
        .accept('text/json')
        .timeout(10 * 1000)
        .end(function (err, xhr) {
            if (!!err){
                return cb('httpError')
            }
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
}

exports.httpGetNoJson = function(url, cb) {
    console.log(url)
    request.get(url)
        .type('application/x-www-form-urlencoded')
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
}

exports.postHttpNoEncoded = function(url, params, cb){
    request.post(url)
        .send(params)
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
}

exports.httpPostJSONTuf8 = function(url, param, cb) {
    console.log(url)
    request.post(url)
        .type('application/json;charset=utf8')
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
                    console.log(body)
                    cb(null, body);
                } else {
                    cb('response has not content');
                }
            } else {
                cb(xhr.statusCode);
            }
        });
}

exports.httpPostJSON = function(url, param, cb) {
    console.log(url)
    request.post(url)
        .type('application/json')
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
                    console.log(body)
                    cb(null, body);
                } else {
                    cb('response has not content');
                }
            } else {
                cb(xhr.statusCode);
            }
        });
}