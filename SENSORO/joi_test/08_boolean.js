/**
 * Created by wyq on 17/1/20.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function boolean() {
	let schema = Joi.boolean();
	let result1 = schema.validate(true);  //经测试: true/false 1/0 均可以被转换为bool值
	console.log(result1);//{ error: null, value: true }
	let result2 = schema.validate(1);
	console.log(result2);//{ error: null, value: true }
	result2 = schema.validate(0);
	console.log(result2);//{ error: null, value: false }
	result2 = schema.validate(10);
	console.log(result2.error.message);//"value" must be a boolean
	console.log(result2.error.details[0].message);//"value" must be a boolean
	result2 = schema.validate(1, {convert: false}); //关闭强制转换
	console.log(result2.error.message);//"value" must be a boolean
	console.log(result2.error.details[0].message);//"value" must be a boolean
}

boolean();



