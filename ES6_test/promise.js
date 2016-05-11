var redis = require("redis");
var redisClient = redis.createClient();
/*
 function timeout(ms) {
 return new Promise((resolve, reject) => {
 setTimeout(resolve, ms, 'done');
 })
 }
 timeout(100).then((value) => {
 console.log(value);
 })
 */

/*
 var p1 = new Promise(function (resolve, reject) {
 redisClient.hgetall("test", function (err, data) {
 err = "err test";
 if (!!err) {
 return reject(err);
 }
 return resolve(data);
 });
 })
 p1.then(result => {
 console.log(result);
 })
 p1.catch(err => {
 console.log(err);
 })
 */

/*
 var p = new Promise(function (resolve, reject) {
 redisClient.hgetall("test", function (err, data) {
 //err = "err test";
 if (!!err) {
 return reject(err);
 }
 return resolve(data);
 });
 })
 p.then((val) => {
 console.log(val);
 }).catch((err) => {
 console.log(err);
 })
 */

/*
 var p = new Promise(function (resolve, reject) {
 redisClient.hgetall("test", function (err, data) {
 err = "err test";
 if (!!err) {
 return reject(err);
 }
 return resolve(data);
 });
 })
 p.then((val) => console.log(val))
 .then(null, (err) => console.log(err));
 */

/*
 var someAsyncThing = function () {
 return new Promise(function (resolve, reject) {
 resolve(x + 2); //报错
 });
 };
 someAsyncThing().then(function (val) {
 console.log("AAA"); //不会执行
 });
 */

/*
 process.on('unhandledRejection', function (err, p) {
 console.error(err.stack)
 });
 var promise = new Promise(function(resolve, reject) {
 resolve("ok");
 setTimeout(function() { throw new Error('test') }, 0)
 });
 promise.then(function(value) { console.log(value) });
 */

/*
 var someAsyncThing = function () {
 return new Promise(function (resolve, reject) {
 resolve(x + 2);
 });
 };
 someAsyncThing()
 .catch(function (err) {
 console.log("oh on", err);
 })
 .then(function () {
 console.log("carry on");
 });
 */

/*
 Promise.resolve()
 .catch(function(err){
 console.log("oh no", err);
 })
 .then(function(){
 console.log("carry on");
 });
 */

/*
 var someAsyncThing = function () {
 return new Promise(function (resolve, reject) {
 resolve(x + 2);
 });
 };
 someAsyncThing()
 .then(function () {
 return someAsyncThing();
 })
 .catch(function (err) {
 console.log("oh no", err);
 y + 2;
 })
 .then(function () {
 console.log("carry on");
 })
 .catch(function (err) {
 console.log("oh no", err);
 });
 */

/*
 var p1 = new Promise(function (resolve, reject) {
 redisClient.hgetall("test", function (err, data) {
 if (!!err) {
 return reject(err);
 }
 console.log("hgetall");
 setTimeout(function () {
 return resolve(data);
 }, 100);

 });
 });

 var p2 = new Promise(function (resolve, reject) {
 redisClient.hkeys("test", function (err, data) {
 if (!!err) {
 return reject(err);
 }
 console.log("hkeys");
 setTimeout(function () {
 return resolve(data);
 }, 100);
 });
 });

 var p3 = new Promise(function (resolve, reject) {
 redisClient.hvals("test", function (err, data) {
 err = "err test";
 if (!!err) {
 return reject(err);
 }
 console.log("hvals");
 return resolve(data);
 });
 });
 */

/*
 var p = Promise.all([p1, p2, p3]);
 p.then(function (data) {
 console.log(data);
 })
 .catch(function (err) {
 console.log(err);
 });
 */

/*
 var p = Promise.race([p1, p2, p3]);
 p.then(function (data) {
 console.log(data);
 })
 .catch(function (err) {
 console.log(err);
 });
 */

/*
 var p = Promise.resolve("Hello");
 p.then(function (s) {
 console.log(s);
 });
 */

/*
 var p = Promise.reject("Error");
 p.then(null, function (s) {
 console.log(s);
 });
 p.catch(function (err) {
 console.log(err);
 });
 */

















