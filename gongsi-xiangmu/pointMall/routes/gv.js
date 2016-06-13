
var exec = require('child_process').exec
var env = require('../env-config');
var config = require('../config');
var moment = require('moment');
var fs = require('fs');
var path = require('path')

function ensureTempDirExist(){
    var temp = config.fileUploadDir + '/temp'
    if (env == 'localhost'){
        temp = path.join(__dirname, '..', 'temp')
    }
    if (!fs.existsSync(temp)){
        fs.mkdir(temp, function(err) {
            if (err) {
                console.log('create temp dir fail:', err)
            }
        });
    }
}
ensureTempDirExist();


function getNonceStr(){
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    var maxPos = $chars.length;
    var noceStr = "";
    for (var i = 0; i < 4; i++) {
        noceStr += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
}

exports.generate = function(req, res){
    var cmd = ["python", "../lib/gv.py"];
    var chars = getNonceStr()
    var fileName = moment(new Date()).format('YYYYMMDDHHmmss') + '.jpg'
    var filePath = config.fileUploadDir + '/temp'
    if (env == 'localhost'){
        filePath = path.join(__dirname, '..', 'temp')
    }
    filePath += '/' + fileName
    cmd = cmd.concat(['-t', chars, '-f', filePath]);
    exec(
        cmd.join(' '),
        {cwd: __dirname},
        function(err, stdout, stderr) {
            if(err) {
                return res.send(500, err);
            }
            if(stderr) {
                return res.send(500, stderr);
            }
            var url = config.domain + config.nginxFileDir + '/temp/' + fileName;
            if (env == 'localhost'){
                url = 'http://localhost:6001/pointMall/' + fileName;
            }
            req.session.gv = chars;
            res.send(url);
        }
    );
}
