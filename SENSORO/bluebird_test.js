/**
 * Created by sensoro on 16/8/25.
 */
var Promise = require('bluebird');      //http://bluebirdjs.com/docs/api-reference.html
var co = require("co");
var bCb = require("./bluebird_cb.js");
var newCb = Promise.promisifyAll(bCb);

/*bCb.cb1(1, function (err, o) {
 console.log("err: %j, o: %j", err, o);
 });*/

/*co(function *() {
 return yield newCb.cb1Async(1);
 }).then(val => {
 console.log("val: %j", val);
 }).catch(err => {
 console.log("err: %j", err.message);
 });*/

/*co(function *() {
 return yield newCb.cb1Async(0);
 }).then(val => {
 console.log("val: %j", val);
 }).catch(err => {
 console.log("err: %j", err.message);
 });*/

/*newCb.cb1Async(1).catch(err => {
 console.log("err: %j", err.message)
 });*/

/*newCb.cb1Async(0).then(val => {
 console.log("val: %j", val);
 });*/

/*newCb.cb2Async(1)
	.then(val => {
		console.log("val: %j", val);
	})
	.catch(err => {
		console.log(err);
		console.log(err.message);
		console.log(JSON.stringify(err));
		console.log(err.code);
		console.log(err.msg);
		console.log(err.info);
		console.log("err: %j", err);
	});*/





console.log("asdfasfd'AAAA'asdfasf");