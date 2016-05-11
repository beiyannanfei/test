/**
 * Created by wyq on 2015/9/17.
 */
var app = require("koa")();
var Router = require("koa-router");
var myRouter = new Router();

myRouter.get("/", function *(next) {
    //this.response.body = "Hello Koa";
    this.body = "Hello Koa aaa";
});

app.use(myRouter.routes());
app.listen(3000);


