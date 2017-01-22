/**
 * Created by wyq on 17/1/22.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function object() {
	let schema = {a: Joi.string(), b: Joi.number()};  //json格式
	let result = Joi.validate({a: "A", b: 1}, schema);  //js格式的schema必须要使用Joi.validate验证
	console.log(result);//{ error: null, value: { a: 'A', b: 1 } }
	schema = Joi.object({a: Joi.string(), b: Joi.number()});  //joi的schema格式
	result = schema.validate({a: "B", b: 2});
	console.log(result);//{ error: null, value: { a: 'B', b: 2 } }
	schema = Joi.object().keys({a: Joi.string(), b: Joi.number()}); //和Joi.object模式相同
	result = schema.validate({a: "C", b: 3});
	console.log(result);//{ error: null, value: { a: 'C', b: 3 } }
}

function min() {  //制定键值的最小数量
	let schema = Joi.object().min(2);
	let result = schema.validate({a: 10, b: 20});
	console.log(result);//{ error: null, value: { a: 10, b: 20 } }
	result = schema.validate({a: 10});
	console.log(result.error.message);//"value" must have at least 2 children
}

function max() {
	let schema = Joi.object().max(2);
	let result = schema.validate({a: 10, b: 20, c: 30});
	console.log(result.error.message);//"value" must have less than or equal to 2 children
	result = schema.validate({a: 10, b: 20});
	console.log(result);//{ error: null, value: { a: 10, b: 20 } }
}

function length() {
	let schema = Joi.object().length(2);
	let result = schema.validate({a: 10, b: 20});
	console.log(result);//{ error: null, value: { a: 10, b: 20 } }
	result = schema.validate({a: 10, b: 20, c: 30});
	console.log(result.error.message);//"value" must have 2 children
	result = schema.validate({a: 10});
	console.log(result.error.message);//"value" must have 2 children
}

function pattern() {  //指定未定义键的验证规则
	let schema = Joi.object({
		a: Joi.string()
	}).pattern(/\w\d/, Joi.number()); //字母和数字组合的键值必须为数字
	let result = schema.validate({a: "a", b: 123}, {allowUnknown: true});
	console.log(result);//{ error: null, value: { a: 'a', b: 123 } }
	result = schema.validate({a: "a", b_0: "b"});
	console.log(result.error.message);//child "b_0" fails because ["b_0" must be a number]
}

function and() {  //指定某些key的关联关系
	let schema = Joi.object({
		a: Joi.any(),
		b: Joi.any()
	}).and('a', 'b'); //a b必须同时存在
	let result = schema.validate({a: "a"});
	console.log(result.error.message);//"value" contains [a] without its required peers [b]
	result = schema.validate({b: "b"});
	console.log(result.error.message);//"value" contains [b] without its required peers [a]
	result = schema.validate({c: "c"}, {allowUnknown: true});
	console.log(result);//{ error: null, value: { c: 'c' } }
}

function nand() { //不能同时存在
	let schema = Joi.object({
		a: Joi.any(),
		b: Joi.any()
	}).nand('a', 'b');
	let result = schema.validate({a: 1, b: 2});
	console.log(result.error.message);//"a" must not exist simultaneously with [b]
	result = schema.validate({a: 1});
	console.log(result);//{ error: null, value: { a: 1 } }
	result = schema.validate({c: 3}, {allowUnknown: true});
	console.log(result);//{ error: null, value: { c: 3 } }
}

function or() {
	let schema = Joi.object({
		a: Joi.any(),
		b: Joi.any()
	}).or('a', 'b');
	let result = schema.validate({a: 1, b: 2});
	console.log(result);//{ error: null, value: { a: 1, b: 2 } }
	result = schema.validate({a: 1});
	console.log(result);//{ error: null, value: { a: 1 } }
	result = schema.validate({b: 2});
	console.log(result);//{ error: null, value: { b: 2 } }
	result = schema.validate({c: 3}, {allowUnknown: true});
	console.log(result.error.message);//"value" must contain at least one of [a, b]
}

function xor() {  //异或(必须存在一个且互斥)
	let schema = Joi.object({
		a: Joi.any(),
		b: Joi.any()
	}).xor('a', 'b');
	let result = schema.validate({a: 1, b: 2});
	console.log(result.error.message);//"value" contains a conflict between exclusive peers [a, b]
	result = schema.validate({c: 3}, {allowUnknown: true});
	console.log(result.error.message);//"value" must contain at least one of [a, b]
	result = schema.validate({a: 1});
	console.log(result);//{ error: null, value: { a: 1 } }
}

function obj_with() {
	let schema = Joi.object({
		a: Joi.any(),
		b: Joi.any()
	}).with('a', 'b');  //指定a存在时b也要存在(但是b存在时a可以不在)
	let result = schema.validate({a: 1});
	console.log(result.error.message);//"a" missing required peer "b"
	result = schema.validate({b: 2});
	console.log(result);//{ error: null, value: { b: 2 } }
	schema = Joi.object({
		a: Joi.any(),
		a1: Joi.any(),
		a2: Joi.any(),
		b: Joi.any(),
		b1: Joi.any(),
		b2: Joi.any()
	})
		.with('a', ['a1', 'a2'])  //a存在时 a1 a2需要也存在
		.with('b', ['b1', 'b2']); //b存在时 b1 b2需要也存在
	result = schema.validate({a: 1, a1: 10});
	console.log(result.error.message);//"a" missing required peer "a2"
	result = schema.validate({a: 1, a1: 10, a2: 11, b: 2});
	console.log(result.error.message);//"b" missing required peer "b1"
	result = schema.validate({a: 1, a1: 10, a2: 11, b1: 2});
	console.log(result);//{ error: null, value: { a: 1, a1: 10, a2: 11, b1: 2 } }
}

function without() {
	let schema = Joi.object({
		a: Joi.any(),
		a1: Joi.any(),
		a2: Joi.any(),
		b: Joi.any(),
		b1: Joi.any(),
		b2: Joi.any()
	})
		.without('a', ['a1', 'a2'])  //a存在时 a1 a2都不能存在
		.without('b', ['b1', 'b2']); //b存在时 b1 b2都不能存在
	let result = schema.validate({a: 1, a1: 10});
	console.log(result.error.message);//"a" conflict with forbidden peer "a1"
	result = schema.validate({a: 1, b: 2, b1: 21});
	console.log(result.error.message);//"b" conflict with forbidden peer "b1"
	result = schema.validate({a: 1, b: 2});
	console.log(result);//{ error: null, value: { a: 1, b: 2 } }
	result = schema.validate({a1: 1, b1: 2});
	console.log(result);//{ error: null, value: { a1: 1, b1: 2 } }
}

function rename() {
	let schema = Joi.object({
		a: Joi.number()
	}).rename("b", "a");
	let result = schema.validate({b: 20}, {allowUnknown: true});
	console.log(result);//{ error: null, value: { a: 20 } }
	schema = Joi.object({
		a: Joi.number()
	}).rename("b", "a", {alias: true});
	result = schema.validate({b: 20}, {allowUnknown: true});
	console.log(result);//{ b: 20, a: 20 } }
	schema = Joi.object({
		a: Joi.number()
	})
		.rename("b", "a")
		.rename("c", "a", {multiple: true});
	result = schema.validate({b: 20, c: 30}, {allowUnknown: true});
	console.log(result);//{ error: null, value: { a: 30 } }
	schema = Joi.object({
		a: Joi.number()
	}).rename("b", "a", {override: true});
	result = schema.validate({a: 10, b: 20}, {allowUnknown: true});
	console.log(result);//{ error: null, value: { a: 20 } }
}

function assert() {
	let schema = Joi.object().keys({
		a: {
			b: Joi.string(),
			c: Joi.number()
		},
		d: {
			e: Joi.any()
		}
	}).assert('d.e', Joi.ref('a.c'), "-----equal to a.c-----");
	let result = schema.validate({a: {b: "b", c: 1}, d: {e: 1}});
	console.log(result);//{ error: null, value: { a: { b: 'b', c: 1 }, d: { e: 1 } } }
	result = schema.validate({a: {b: "b", c: 1}, d: {e: 10}});
	console.log(result.error.message);//"d.e" validation failed because "d.e" failed to -----equal to a.c-----
}

function unknown() {  //允许未定义键
	let schema = Joi.object({a: Joi.any()}).unknown();
	let result = schema.validate({a: 10, b: 20});
	console.log(result);//{ error: null, value: { a: 10, b: 20 } }
}

function requiredKeys() {
	let schema = Joi.object().keys({
		a: {
			b: Joi.number()
		},
		c: {
			d: Joi.string()
		}
	});
	let requiredSchema = schema.requiredKeys('', 'a.b', 'c', 'c.d');//b c d是必须值
	let result = requiredSchema.validate({a: {}, c: {d: "d"}});
	console.log(result.error.message);//child "a" fails because [child "b" fails because ["b" is required]]
}

function optionalKeys() {
	let schema = Joi.object().keys({
		a: {
			b: Joi.number().required()
		},
		c: {
			d: Joi.string().required()
		}
	});
	let optionalSchema = schema.optionalKeys('a.b', 'c.d');//将b d设置为可选项
	let result = optionalSchema.validate({a: {}, c: {}});
	console.log(result);//{ error: null, value: { a: {}, c: {} } }
}

