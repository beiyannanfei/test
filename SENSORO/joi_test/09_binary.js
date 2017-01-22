/**
 * Created by wyq on 17/1/22.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function binary() {
	let schema = Joi.binary();
	let result = schema.validate("ABCDEF");
	console.log(result);//{ error: null, value: <Buffer 41 42 43 44 45 46> }
	result = schema.validate("ABCDEF", {convert: false});
	console.log(result.error.message);              //"value" must be a buffer or a string
	console.log(result.error.details[0].message);   //"value" must be a buffer or a string
}

function encoding() {
	let schema = Joi.binary().encoding("hex");
	let result = schema.validate("ABCDEF");
	console.log(result.value);  //<Buffer ab cd ef>
	schema = Joi.binary().encoding("utf8");
	result = schema.validate("ABCDEF");
	console.log(result.value);  //<Buffer 41 42 43 44 45 46>
	schema = Joi.binary().encoding("utf-8");
	result = schema.validate("ABCDEF");
	console.log(result.value);  //<Buffer 41 42 43 44 45 46>
	schema = Joi.binary().encoding("ascii");
	result = schema.validate("ABCDEF");
	console.log(result.value);  //<Buffer 41 42 43 44 45 46>
	schema = Joi.binary().encoding("binary");
	result = schema.validate("ABCDEF");
	console.log(result.value);  //<Buffer 41 42 43 44 45 46>
	schema = Joi.binary().encoding("base64");
	result = schema.validate("ABCDEF");
	console.log(result.value);  //<Buffer 00 10 83 10>
	schema = Joi.binary().encoding("ucs2");
	result = schema.validate("ABCDEF");
	console.log(result.value);  //<Buffer 41 00 42 00 43 00 44 00 45 00 46 00>
	schema = Joi.binary().encoding("ucs-2");
	result = schema.validate("ABCDEF");
	console.log(result.value);  //<Buffer 41 00 42 00 43 00 44 00 45 00 46 00>
	schema = Joi.binary().encoding("utf16le");
	result = schema.validate("ABCDEF");
	console.log(result.value);  //<Buffer 41 00 42 00 43 00 44 00 45 00 46 00>
	schema = Joi.binary().encoding("utf-16le");
	result = schema.validate("ABCDEF");
	console.log(result.value);  //<Buffer 41 00 42 00 43 00 44 00 45 00 46 00>
}

function len() {
	let schema = Joi.binary().min(2);
	let result = schema.validate("AB");
	console.log(result);//{ error: null, value: <Buffer 41 42> }
	result = schema.validate("C");
	console.log(result.error.message);//"value" must be at least 2 bytes
	console.log(result.error.details[0].message + "\n==================");//"value" must be at least 2 bytes
	schema = Joi.binary().max(2);
	result = schema.validate("ABC");
	console.log(result.error.message);//"value" must be less than or equal to 2 bytes
	console.log(result.error.details[0].message + "\n==================");//"value" must be less than or equal to 2 bytes
	schema = Joi.binary().length(2);
	result = schema.validate("ABC");
	console.log(result.error.message);  //"value" must be 2 bytes
	console.log(result.error.details[0].message);//"value" must be 2 bytes
}



