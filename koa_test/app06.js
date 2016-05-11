/**
 * Created by wyq on 2015/9/17.
 */
var app = require("koa")();
var Router = require("koa-router");
var router = new Router({
        prefix: "/users"
    }
);

router.get("/", function *(next) {
    this.body = "/users";
});


app.use(router.routes());
app.listen(3000);


