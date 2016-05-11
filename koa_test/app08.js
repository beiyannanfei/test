/**
 * Created by wyq on 2015/9/17.
 */
var app = require("koa")();
var Router = require("koa-router");
var router = new Router();

router.get("/", function *() {
    this.body = "hello koa";
    this.redirect("http://javascript.ruanyifeng.com/nodejs/koa.html");
});


app.use(router.routes());
app.listen(3000);

