/**
 * Created by wyq on 2015/8/14.
 */
var redis = require('redis');

var redisClient = redis.createClient(6379, '127.0.0.1');

var source = "source";
var destination = "destination";

//redisClient.BRPOPLPUSH("source", "destination", 0, function (err, results) {
//    console.log(err, results);
//});

//console.log(/^0\d{2,3}-?\d{7,8}$/.test("0316-62620505"));

//console.log(/^(\+86){0,1}1[3|5|7|8](\d){9}$/.test("18810776836"));

//console.log(/^[a-zA-Z_]/.test("_"));

//console.log(/^\w{6,20}$/.test("_____1"));

//console.log(/^0[0-9]{2,3}$/.test("0120"));

//console.log(/^[\u4E00-\u9FA5]+$/.test("你好")); //检验中文
/*

var a = /^[\u4E00-\u9FA5]+$/;
var b = "你好a";
console.log(a.exec(b));
*/

/*
function isDigit(s) {
    var patrn = /^[0-9]{1,20}$/;
    if (!patrn.exec(s))
        return false;
    return true;
}

console.log(isDigit("132a"));
*/

console.log(/^\(?0\d{2}(\)|-|\b)?\d{8}$/.test("022-22334455"));


