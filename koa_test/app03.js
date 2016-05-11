/**
 * Created by wyq on 2015/9/17.
 */

var koa = require("koa");
var app = new koa();

function *random(next) {
    if ('/random' == this.path) {
        this.body = Math.floor(Math.random()*10);
    } else {
        yield next;
    }
};

function *backwards(next) {
    if ('/backwards' == this.path) {
        this.body = 'sdrawkcab';
    } else {
        yield next;
    }
}

function *pi(next) {
    if ('/pi' == this.path) {
        this.body = String(Math.PI);
    } else {
        yield next;
    }
}

function *all(next) {
    yield random.call(this, backwards.call(this, pi.call(this, next)));
}

app.use(all);

app.listen(3000);




