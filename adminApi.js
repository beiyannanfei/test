/**
 * Created by wyq on 2015/9/15.
 */

var Router = require("koa-router");
var adminRouter = new Router({
    prefix: '/admin'
});

module.exports = adminRouter;

adminRouter.get("/", function *() {
    console.log("******************admin");
    this.body = "that is admin page";
    this.redirect("http://javascript.ruanyifeng.com/nodejs/koa.html");
});

adminRouter.get("/:id", function *() {
    var id = this.params.id;
    this.body = id + '\n';
    var retVal = yield checkParam;
    console.log("retVal: %j", retVal);
});

var checkParam = function *(next) {
    var id = this.params.id;
    if (id > 10) {
        this.body += "bigger than 10\n";
    }
    else {
        this.body += "less than 10\n";
    }
    return "aaaa";
};




