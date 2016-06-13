'use strict';

var koa = require('koa')
var middlewares = require('./middleware')
var config = require('./config.js')
var path = require('path')
var http = require('http')
var routes = require('./routes')
var router = middlewares.router()


var app = new koa()

// middleware
app.use(middlewares.favicon())
app.use(middlewares.rt())
app.use(middlewares.staticCache(path.join(__dirname, 'public'), {
    buffer: !config.debug,
    maxAge: config.debug ? 0 : 60 * 60 * 24 * 7
}))
app.use(middlewares.bodyParser())

app.use(middlewares.logger())
app.use(middlewares.views(path.join(__dirname, 'views'), {
    map: {
        html: 'handlebars'
    }
}))

// routes
routes(router)
app.use(router.routes())


app.listen(config.port)