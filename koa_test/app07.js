/**
 * Created by wyq on 2015/9/17.
 */
var app = require("koa")();
var Router = require("koa-router");
var router = new Router();

router.get("/:category/:title", function*(next) {
    console.log(this.params);
});

router
    .get('/a/users/:user', function *(next) {
        this.body = this.user;
    })
    .param('user', function *(id, next) {
        var users = ['0号用户', '1号用户', '2号用户'];
        this.user = users[id];
        if (!this.user) return this.status = 404;
        yield next;
    });

app.use(router.routes());
app.listen(3000);


