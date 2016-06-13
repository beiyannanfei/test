var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var redisStore = require('connect-redis')(express);
var config = require('./config.js');
var wxInfo = require('./routes/wxInfo.js');
var exphbs = require('express3-handlebars');
var api = require('./routes/api');
var env = require('./env-config');
var middleware = require('./routes/middleware');

var helpers     = require('prettify');


var redisHost = config.redis.host;
var redisPort = config.redis.port;

process.on('uncaughtException', function (err) {
    console.log('[Inside \'uncaughtException\' event]' + err.stack || err.message);
    if (env != 'localhost'){
        wxInfo.pushErrorMsg('env: ' + config.NODE_ENV + '\n' + err + '\n' + err.stack)
    }
});

var logToken = '[:date] - :method :url :status :res[content-length] - :response-time ms';
express.logger.token('date', function(){
    return new Date().toLocaleString();
});

app.use(express.favicon());
app.use(express.logger(logToken));
app.use(express.bodyParser({maxFieldsSize: 1 * 1024 * 1024}))
app.use(express.methodOverride());
app.use(express.cookieParser());

app.use(middleware.setSession(app, redisStore, express));

var hbs = exphbs.create({
    helpers: {
        equals:function(a, b, opts) {
            if(a == b) // Or === depending on your needs
                return opts.fn(this);
            else
                return opts.inverse(this);
        }
    }
});
app.set('view engine', 'html');
if (config.NODE_ENV != 'dev'){
    app.set('view cache', true);
}
app.engine('html', hbs.engine);

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(function(req, res, next){
    if (req.session && req.session.flash)   {
        res.locals.flash = req.session.flash;
        delete req.session.flash;
    }
    next();
});

app.use(config.path, api);
app.set('port', 6001)

exports.server = require('http').createServer(app)
exports.server.listen(app.get('port'), function () {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

