/**
 * Created by wyq on 17/1/22.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function func() {
	let schema = Joi.func();
	let result = schema.validate(function () {
	});
	console.log(result);//{ error: null, value: [Function] }
	var f = function () {
	};
	result = schema.validate(f);
	console.log(result);//{ error: null, value: [Function] }
}

function arity() {
	var f0 = function () {
	};
	var f1 = function (a) {
	};
	var f2 = function (a, b) {
	};
	var f3 = function (a, b, c) {
	};
	let schema = Joi.func().arity(2); //验证参数个数
	let result = schema.validate(f0);
	console.log(result.error.message);  //"value" must have an arity of 2
	result = schema.validate(f1);
	console.log(result.error.message);  //"value" must have an arity of 2
	result = schema.validate(f2);
	console.log(result);  //{ error: null, value: [Function] }
	result = schema.validate(f3);
	console.log(result.error.message);  //"value" must have an arity of 2
}

function minArity() { //最少参数
	var f0 = function () {
	};
	var f1 = function (a) {
	};
	var f2 = function (a, b) {
	};
	var f3 = function (a, b, c) {
	};
	let schema = Joi.func().minArity(1);
	let result = schema.validate(f0);
	console.log(result.error.message); //"value" must have an arity greater or equal to 1
	result = schema.validate(f1);
	console.log(result); //{ error: null, value: [Function] }
	result = schema.validate(f2);
	console.log(result); //{ error: null, value: [Function] }
}

function maxArity() { //最多参数验证
	var f0 = function () {
	};
	var f1 = function (a) {
	};
	var f2 = function (a, b) {
	};
	var f3 = function (a, b, c) {
	};
	let schema = Joi.func().maxArity(2);
	let result = schema.validate(f0);
	console.log(result);  //{ error: null, value: [Function] }
	result = schema.validate(f1);
	console.log(result);  //{ error: null, value: [Function] }
	result = schema.validate(f2);
	console.log(result);  //{ error: null, value: [Function] }
	result = schema.validate(f3);
	console.log(result.error.message);  //"value" must have an arity lesser or equal to 2
}


