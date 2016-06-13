/**
 * Created by chenjie on 2014/8/21.
 */

var _ = require('underscore')
var os = require('os');
var jsonxml = require('jsontoxml');
var mobileRegex = /^[0-9]{8,13}$/
var urlReg = /^(https|http):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/

exports.doc2Object = function(docs){
    if (!docs) return null;

    if (_.isArray(docs)){
        var results = [];
        _.each(docs, function(doc){
            results.push(doc.toObject && typeof(doc.toObject) == 'function' ?  doc.toObject() : doc);
        })
        return results;
    } else{
        return docs.toObject && typeof(docs.toObject) == 'function' ?  docs.toObject() : docs;
    }
}


exports.resToClient = function(req, res, data){
    var callback = req.param('callback');
    if (callback) {
        var str =  callback + '(' + data?JSON.stringify(data):"" + ')';//jsonp
        res.send(str);
    } else {
        res.send(data);//普通的json
    }
};

exports.jsonToXml = function(json){
    return '<xml>' + jsonxml(json, {}) + '</xml>'
}

exports.checkPositiveInt = function(v){
    v = parseInt(v, 10);
    if (isNaN(v) || v < 0){
        return null;
    } else {
        return v;
    }
}

exports.checkInt = function(v){
    v = parseInt(v, 10);
    if (isNaN(v)){
        return null;
    } else {
        return v;
    }
}

exports.checkPositiveFloat = function(v){
    v = parseFloat(v);
    if (isNaN(v) || v < 0){
        return null;
    } else {
        return Math.floor(v * 1000) / 1000;
    }
}

exports.checkPositive0Float = function(v){
    v = parseFloat(v);
    if (isNaN(v)){
        return null;
    } else {
        return Math.floor(v * 1000) / 1000;
    }
}

exports.isMobile = function(mobile){
    if (mobileRegex.test(mobile)){
        return true
    }else {
        return false
    }
}

exports.isUrlReg = function(url){
    if (urlReg.test(url)){
        return true
    }else {
        return false
    }
}

exports.getLocalIp = function(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
    return '172.0.0.1';
}

exports.groupCondition = function(condition, req){
    condition.tvmId = req.tvmId
}

exports.groupDoc = function(doc, req){
    doc.tvmId = req.tvmId
    doc.yyyappId = req.yyyappId
}

exports.groupDocWithToken = function(doc, token, req){
    doc.tvmId = req.tvmId
    doc.yyyappId = req.yyyappId
    doc.token = token
}

exports.arrToMap = function(arr, key){
    var map = {}
    _.each(arr, function(o){
        if (o[key]){
            map[o[key].toString()] = o
        }
    })
    return map
}

exports.isObjectValueEqual = function(a, b) {
    for (var aKey in a){
        if (!b[aKey] || b[aKey] != a[aKey]){
            return false
        }
    }
    return true;
}