/**
 * Created by chenjie on 2015/7/3.
 */

var fs = require('fs');
var config = require('../config');
var _ = require('underscore');

exports.authAdminSession = function(req, res, next){
    console.log(req.session)
    if (!req.session.tvmId){
        return res.send(401, '没有用户身份')
    }
    if (!req.session.yyyappId){
        return res.send(401, '没有用户身份')
    }

    req.tvmId = req.session.tvmId
    req.yyyappId = req.session.yyyappId
    next()
}

exports.menu = function(req, res){
    var entry = req.param('entry')
    var tvmId = req.param('tvmid')
    var yyyappId = req.param('yyyappid')
    var query = req.query

    if (tvmId){
        req.tvmId = req.session.tvmId = tvmId;
    } else {
        res.send(400, 'param tvmid is required');
    }

    if (yyyappId){
        req.yyyappId = req.session.yyyappId = yyyappId;
    }  else {
        res.send(400, 'param yyyappid is required');
    }

    delete query.yyyappid
    delete query.tvmid
    delete query.entry

    var url = '/admin/page/' + entry + '?'
    console.log(query)
    _.map(query, function(k, v){
        url += v + '=' + k + '&'
    })
    res.redirect(url)
}

var header = fs.readFileSync('public/tpl/header.html', 'utf-8')
var fileCache = {}
var footer = fs.readFileSync('public/tpl/footer.html', 'utf-8')

function render(fileName, res){
    var str = header;
    if (fileCache[fileName] && config.NODE_ENV != 'dev'){
        str += fileCache[fileName];
        str += footer
        res.write(str)
        res.end()
    } else {
        fs.readFile('public/tpl/'+fileName+'.html','utf-8',function(err,data){
            if (err){
                render(404, res)
            } else {
                if (config.NODE_ENV != 'dev'){
                    fileCache[fileName] = data
                }
                str += data;
                str += footer
                res.write(str)
                res.end()
            }
        })
    }
}

exports.goAdminPage = function(req, res){
    var pageName = req.param('pageName')
    if (!pageName){
        render('404', res)
    } else {
        render(pageName, res)
    }
}