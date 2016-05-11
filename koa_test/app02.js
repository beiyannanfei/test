/**
 * Created by wyq on 2015/9/17.
 */

var koa = require("koa");
var app = new koa();

function logger(format) {
    return function *(next) {
        var str = format
            .replace(':method', this.method)
            .replace(':url', this.url);

        console.log(str);

        yield next;
    }
}

app.use(logger(':method :url'));
app.use(function *() {
    this.body = "hello koa";
});

app.listen(3000);




