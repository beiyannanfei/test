/**
 * Created by wyq on 17/1/19.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function abortEarly() {   //是否发现错误就终止(默认是)
	var schema = Joi.object().keys({
		a: Joi.number(),
		b: Joi.string()
	});

	var checkObj = {
		a: "abcdef",
		b: 123
	};
	let result1 = Joi.validate(checkObj, schema);//只会返回遇到的第一个错误
	console.log("msg: %s, errDetail: %j", result1.error.message, result1.error.details);
	let result2 = Joi.validate(checkObj, schema, {abortEarly: false});//返回检测到得所有错误
	console.log(result2.error.message);
	console.log(result2.error.details);
}

function convert() {  //是否尝试进行类型转换(默认true)
	var schema = Joi.object().keys({
		a: Joi.number()
	});
	var checkObj = {
		a: "123"
	};
	let result1 = Joi.validate(checkObj, schema);//会将"123"转换为数字,从而不会报错
	console.log(result1);//{ error: null, value: { a: 123 } }
	let result2 = Joi.validate(checkObj, schema, {convert: false});
	console.log(result2.error.message);
}

function allowUnknown() { //是否允许有未定义值(默认false)
	var schema = Joi.object().keys({
		a: Joi.number()
	});
	var checkObj = {
		a: 123,
		b: "abcd"
	};
	let result1 = Joi.validate(checkObj, schema);//schema中没有定义键b,所以报错
	console.log(result1.error.message);//"b" is not allowed
	let result2 = Joi.validate(checkObj, schema, {allowUnknown: true}); //允许未定义数据
	console.log(result2);//{ error: null, value: { a: 123, b: 'abcd' } }
}

function skipFunctions() {  //当未定义的key值为函数时是否跳过(默认false)
	var schema = Joi.object().keys({
		a: Joi.number()
	});
	var checkObj = {
		a: 123,
		b: function () {
		}
	};
	let result1 = Joi.validate(checkObj, schema);
	console.log(result1.error.message);//"b" is not allowed
	let result2 = Joi.validate(checkObj, schema, {skipFunctions: true});
	console.log(result2); //{ error: null, value: { a: 123, b: [Function] } }
}






