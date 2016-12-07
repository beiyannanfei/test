/**
 * Created by wyq on 16/12/6.
 */
"use strict";
var Seq = require("seq");

/*
 Seq().seq(function () {
 console.log("begin");
 var self = this;
 setTimeout(self, 1000, null, ["AAA", "BBB", "CCC"]);
 }).flatten().parEach(function (val0) {
 console.log("val0: %j", val0);
 var self = this;
 return setTimeout(self, 1000, null, val0.toLowerCase());
 }).seq(function (val) {
 console.log("val: %j, this.vars: %j", val, this.vars);
 var self = this;
 setTimeout(self, 1000, "err test");
 }).catch(function (err) {
 console.log("err: %j", err);
 });
 */

/*var fs = require('fs');
 var Hash = require('hashish');
 var Seq = require('seq');

 Seq().seq(function () {
 fs.readdir(__dirname, this);
 }).flatten().parEach(function (file) {
 fs.stat(__dirname + '/' + file, this.into(file));
 }).seq(function () {
 console.log("======== %j", this.vars);
 var sizes = Hash.map(this.vars, function (s) {
 return s.size
 });
 console.dir(sizes);
 });*/

var fs = require('fs');
var exec = require('child_process').exec;

var Seq = require('seq');
Seq().seq(function () {
	exec('whoami', this)
}).par(function (who) {
	console.log("who: %j", who);
	exec('groups ' + who, this);
}).par(function (who) {
	console.log("who: %j", who);
	fs.readFile(__filename, 'ascii', this);
}).seq(function (groups, src) {
	console.log('Groups: ' + groups.trim());
	console.log('This file has ' + src.length + ' bytes');
});





