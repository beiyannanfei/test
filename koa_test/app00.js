/**
 * Created by wyq on 2015/9/17.
 */

var koa = require("koa");
var app = new koa();

app.use(function *() {
    this.body = "Hello koa\n";
    yield saveResults.call(this);
    this.body += "footer\n";
});

function *saveResults() {
    this.body += "results saved!\n"
}

app.listen(3000);




