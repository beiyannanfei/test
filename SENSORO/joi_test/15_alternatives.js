/**
 * Created by wyq on 17/1/22.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function try_test() {
	let schema = Joi.alternatives().try(Joi.number(), Joi.string());
	let result = schema.validate("a");
	console.log(result);//{ error: null, value: 'a' }
	result = schema.validate(10);
	console.log(result);//{ error: null, value: 10 }
	result = schema.validate([]);
	console.log(result.error.message);//"value" must be a number. "value" must be a string
	schema = Joi.alternatives().try([Joi.number(), Joi.string()]);
	result = schema.validate("a");
	console.log(result);//{ error: null, value: 'a' }
	result = schema.validate(10);
	console.log(result);//{ error: null, value: 10 }
	result = schema.validate([]);
	console.log(result.error.message);//"value" must be a number. "value" must be a string
}

function when() {
	let schema = Joi.object({ //和when的区别就是只能用于下边这种选择性的判断
		a: Joi.alternatives().when("b", {is: 5, then: Joi.string(), otherwise: Joi.number()}),
		b: Joi.any()
	});
	let result = schema.validate({a: 1, b: 5});
	console.log(result.error.message);//child "a" fails because ["a" must be a string]
	result = schema.validate({a: "a", b: 4});
	console.log(result.error.message);//child "a" fails because ["a" must be a number]
	result = schema.validate({a: "a", b: 5});
	console.log(result);//{ error: null, value: { a: 'a', b: 5 } }
	console.log("====================");
	schema = Joi.object({//用于下边这种情况下就会失败
		a: Joi.alternatives().when("b", {is: true, then: Joi.required()}),
		b: Joi.boolean()
	});
	result = schema.validate({b: true});
	console.log(result);//{ error: null, value: { b: true } }
}

