var redis = require('redis');
var _ = require("underscore");

var redisClient = redis.createClient(6379, '127.0.0.1');

function *testGenerator() {
    yield 'hello';
    yield 'world';
    yield 'ending';

}

var it = testGenerator();
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
