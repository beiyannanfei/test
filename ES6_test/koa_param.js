/**
 * Created by wyq on 2015/9/17.
 */
var router = require('koa-router');
var querystring = require('querystring');
app.use(router(app));
app.get('/addUser', function *(next) {
    if (!this.req._parsedUrl.query) {
        this.body = "参数错误";
        return;
    }
    var params = querystring.parse(this.req._parsedUrl.query);


    this.req.method;    //请求类型('POST'\'GET')
});
