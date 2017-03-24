/**
 * Created by wyq on 17/1/20.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function array() {
	let schema = {
		a: Joi.array().items(Joi.string().valid('a', 'b'))
	};
	let checkObj = {
		a: ['a', 'b', 'c']
	};
	let results = Joi.validate(checkObj, schema);
	console.log(results.error.details[0].message);//{ error: null, value: { a: [ 'a', 'b', 'a' ] } }
}
array();
function sparse() { //稀疏数组
	let schema = Joi.array();
	let checkObj = [1, 2, undefined, 3];
	let result1 = Joi.validate(checkObj, schema);
	console.log(result1.error.message);//"value" must not be a sparse array
	console.log(result1.error.details[0].message);//"value" must not be a sparse array
	schema = Joi.array().sparse();
	let result2 = Joi.validate(checkObj, schema);
	console.log(result2);//{ error: null, value: [ 1, 2, undefined, 3 ] }
}

function single() { //将单值按照数组元素进行校验
	let schema = Joi.array().items(Joi.number()).single();
	let results1 = schema.validate([4]);
	console.log(results1);//{ error: null, value: [ 4 ] }
	let results2 = schema.validate(3);  //对数值验证
	console.log(results2);//{ error: null, value: [ 3 ] }
}

function items() {
	let schema = Joi.array().items(Joi.string().valid("not allowed").forbidden(), Joi.string());
	let results = schema.validate(["asdf", "not allowed"]);
	console.log(results.error.message);//"value" at position 1 contains an excluded value
	console.log(results.error.details[0].message);//"value" at position 1 contains an excluded value
}

function ordered() {
	//必须是字符串和数字顺序出现且只能有两个元素
	let schema1 = Joi.array().ordered(Joi.string().required(), Joi.number().required());
	let results1 = schema1.validate(['a', 'b']);
	console.log(results1.error.message);//"value" at position 1 fails because ["1" must be a number]
	console.log(results1.error.details[0].message);//"1" must be a number

	console.log("================================");
	//数组的第一个元素必须是字符串且后边至少有一个数字且全是数字
	let schema2 = Joi.array().ordered(Joi.string().required()).items(Joi.number().required());
	let result2 = schema2.validate(["a", 1]);
	console.log(result2);//{ error: null, value: [ 'a', 1 ] }
	result2 = schema2.validate([1]);
	console.log(result2.error.message);//"value" at position 0 fails because ["0" must be a string]
	console.log(result2.error.details[0].message);//"0" must be a string
	result2 = schema2.validate(["a", "b"]);
	console.log(result2.error.message);//"value" at position 1 fails because ["1" must be a number]
	console.log(result2.error.details[0].message);//"1" must be a number
	result2 = schema2.validate(["a", 1, "b"]);
	console.log(result2.error.message);//"value" at position 2 fails because ["2" must be a number]
	console.log(result2.error.details[0].message);//"2" must be a number

	console.log("********************************");
	//最多含有两个元素且第一个必须为字符串第二个为数字
	let schema3 = Joi.array().ordered(Joi.string().required(), Joi.number());
	let result3 = schema3.validate(["a", 1]);
	console.log(result3);//{ error: null, value: [ 'a', 1 ] }
	result3 = schema3.validate([1]);
	console.log(result3.error.message);//"value" at position 0 fails because ["0" must be a string]
	console.log(result3.error.details[0].message);//"0" must be a string
	result3 = schema3.validate(["a", "b"]);
	console.log(result3.error.message);//"value" at position 1 fails because ["1" must be a number]
	console.log(result3.error.details[0].message);//"1" must be a number
	result3 = schema3.validate(["a", 1, 2, 3]);
	console.log(result3.error.message);//"value" at position 2 fails because array must contain at most 2 items
}

function arrayLen() {
	let schema = {
		a: Joi.array().min(2).required(),
		b: Joi.array().max(2).required(),
		c: Joi.array().length(2).required(),
		d: Joi.array().unique().required()
	};
	let checkObj = {
		a: [1],
		b: [1, 2, 3],
		c: [4],
		d: [1, 1, 2]
	};
	let results = Joi.validate(checkObj, schema, {abortEarly: false});
	console.log(results.error.message);//child "a" fails because ["a" must contain at least 2 items]. child "b" fails because ["b" must contain less than or equal to 2 items]. child "c" fails because ["c" must contain 2 items]. child "d" fails because ["d" position 1 contains a duplicate value]
	results.error.details.forEach(item => {
		console.log(item.message);
		// "a" must contain at least 2 items
		// "b" must contain less than or equal to 2 items
		// "c" must contain 2 items
		// "d" position 1 contains a duplicate value
	});
}

