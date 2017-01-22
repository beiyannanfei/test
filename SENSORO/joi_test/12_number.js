/**
 * Created by wyq on 17/1/22.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function number() {
	let schema = Joi.number();
	let result = schema.validate(5);
	console.log(result);//{ error: null, value: 5 }
	result = schema.validate("10");
	console.log(result);//{ error: null, value: 10 }
	result = schema.validate("a");
	console.log(result.error.message);//"value" must be a number
}

function min() {
	let schema = Joi.number().min(2);
	let result = schema.validate(3);
	console.log(result);  //{ error: null, value: 3 }
	result = schema.validate(1);
	console.log(result.error.message);//"value" must be larger than or equal to 2
	schema = Joi.object({
		min: Joi.number().required(),
		max: Joi.number().min(Joi.ref("min")).required()
	});
	result = schema.validate({min: 10, max: 20});
	console.log(result);//{ error: null, value: { min: 10, max: 20 } }
	result = schema.validate({min: 10, max: 9});
	console.log(result.error.details[0].message);//"max" must be larger than or equal to 10
}

function max() {
	let schema = Joi.number().max(5);
	let result = schema.validate(5);
	console.log(result);  //{ error: null, value: 5 }
	result = schema.validate(6);
	console.log(result.error.message);//"value" must be less than or equal to 5
}

function greater() {
	let schema = Joi.number().greater(5);
	let result = schema.validate(5);
	console.log(result.error.message);//"value" must be greater than 5
	result = schema.validate(6);
	console.log(result);//{ error: null, value: 6 }
}

function less() {
	let schema = Joi.number().less(5);
	let result = schema.validate(5);
	console.log(result.error.message);  //"value" must be less than 5
	result = schema.validate(4);
	console.log(result);  //{ error: null, value: 4 }
}

function integer() {
	let schema = Joi.number().integer();
	let result = schema.validate(10);
	console.log(result);//{ error: null, value: 10 }
	result = schema.validate(10.1);
	console.log(result.error.message);//"value" must be an integer
}

function precision() {  //精度(四舍五入)
	let schema = Joi.number().precision(2);
	let result = schema.validate(10.21);
	console.log(result);//precision
	result = schema.validate(10.215);
	console.log(result);//{ error: null, value: 10.22 }
}

function multiple() {   //必须是制定基数的倍数
	let schema = Joi.number().multiple(3);
	let result = schema.validate(6);
	console.log(result);//{ error: null, value: 6 }
	result = schema.validate(7);
	console.log(result.error.message);//"value" must be a multiple of 3
	schema = Joi.number().multiple(3.3);
	result = schema.validate(6.6);
	console.log(result);//{ error: null, value: 6.6 }
	result = schema.validate(6.5);
	console.log(result.error.message);//"value" must be a multiple of 3.3
}

function positive() { //正数
	let schema = Joi.number().positive();
	let result = schema.validate(10);
	console.log(result);//{ error: null, value: 10 }
	result = schema.validate(-10);
	console.log(result.error.message);//"value" must be a positive number
}

function negative() { //负数
	let schema = Joi.number().negative();
	let result = schema.validate(-10);
	console.log(result);//{ error: null, value: -10 }
	result = schema.validate(10);
	console.log(result.error.message);//"value" must be a negative number
}







