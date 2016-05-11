/**
 * Created by wyq on 2015/7/30.
 */


var a ={a:1, b:2, v:3};
console.log(a);
var b = new Buffer(JSON.stringify(a)).toString('base64');
console.log(b);
var c = new Buffer(b, 'base64').toString();
console.log(c);
var d = JSON.parse(c);
console.log(d);