/**
 * Created by wyq on 2015/9/17.
 */

var koa = require("koa");
var app = new koa();

app.use(function *(next){
    console.log('>> one');
    yield next;
    console.log('<< one');
});

app.use(function *(next){
    console.log('>> two');
    this.body = 'two';
    console.log('<< two');
});

app.use(function *(next){
    console.log('>> three');
    yield next;
    console.log('<< three');
});

app.listen(3000);




