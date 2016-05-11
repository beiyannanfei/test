/**
 * Created by wyq on 2015/9/17.
 */
var koa = require("koa");
var app = new koa();

app.use(function *() {
    if(this.path == '/') {
        this.body = "we are at home!";
    }
});

app.listen(3000);
