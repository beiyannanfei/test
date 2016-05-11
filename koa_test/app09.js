/**
 * Created by wyq on 2015/9/17.
 */
var app = require("koa")();
var Router = require("koa-router");
var thunkify = require('thunkify-wrap');
var router = new Router();
var redis = require("redis");
var redisClient = redis.createClient(6379, "127.0.0.1");

redisClient.hgetall = thunkify(redisClient.hgetall);

router.get("/", function *() {

    redisClient.hgetall("test")(function (err, data) {
        console.log("err: %j, data: %j", err, data);
    });
    this.body = "hello koa";
});


app.use(router.routes());
app.listen(3000);

