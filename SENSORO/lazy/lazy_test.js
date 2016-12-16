/**
 * Created by wyq on 16/12/16.
 * 惰性求值函数库使用练习
 */
"use strict";
var Lazy = require("./lazy.js");

function test1() {
	console.log(Lazy([1, 2, 3, 4]).source);
	console.log(Lazy({foo: "bar"}).source);
	console.log(Lazy("hello world!").source);
	console.log(Lazy().toArray());
	console.log(Lazy(null).toArray());
}

test1();

