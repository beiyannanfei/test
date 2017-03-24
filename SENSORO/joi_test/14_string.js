/**
 * Created by wyq on 17/1/22.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function insensitive() {  //大小写不敏感
	let schema = Joi.string().valid("a").insensitive();
	let result = schema.validate("a");
	console.log(result);//{ error: null, value: 'a' }
	result = schema.validate("A");
	console.log(result);//{ error: null, value: 'A' }
}

function min() {
	let schema = Joi.string().min(2);
	let result = schema.validate("a");
	console.log(result.error.message);//"value" length must be at least 2 characters long
}

function max() {
	let schema = Joi.string().max(3, "utf8");
	let result = schema.validate("你好");//一个中文字符长度为3
	console.log(result.error.message);//"value" length must be less than or equal to 3 characters long
}

function truncate() {//截断输出
	let schema = Joi.string().max(5).truncate();
	let result = schema.validate("ABCDEFGH");
	console.log(result);//{ error: null, value: 'ABCDE' }
}

function creditCard() { //信用卡验证
	let schema = Joi.string().creditCard();
	let result = schema.validate("6222600910039636285");
	console.log(result);//{ error: null, value: '6222600910039636285' }
	result = schema.validate("123456789");
	console.log(result.error.message);//"value" must be a credit card
}

function length() {
	let schema = Joi.string().length(5);
	let result = schema.validate("ABCDE");
	console.log(result);//{ error: null, value: 'ABCDE' }
	result = schema.validate("ABCDEF");
	console.log(result.error.message);//"value" length must be 5 characters long
}

function replace() {
	let schema = Joi.string().replace(/b/gi, 'x');
	let result = schema.validate("aBbc");
	console.log(result);//{ error: null, value: 'axxc' }
}

function alphanum() { //要求字符串只能包含a-z A-Z 0-9
	let schema = Joi.string().alphanum();
	let result = schema.validate("asdf123ASDF");
	console.log(result);//{ error: null, value: 'asdf123ASDF' }
	result = schema.validate("asdf123AS_DF");
	console.log(result.error.message);//"value" must only contain alpha-numeric characters
}

function token() {//a-z, A-Z, 0-9,_
	let schema = Joi.string().token();
	let result = schema.validate("abc_123_ABC");
	console.log(result);//{ error: null, value: 'abc_123_ABC' }
	result = schema.validate("abc_123_ABC-");
	console.log(result.error.message);//"value" must only contain alpha-numeric and underscore characters
}

function email() {
	let schema = Joi.string().email();
	let result = schema.validate("assdf@abc.com");
	console.log(result);//{ error: null, value: 'assdf@abc.com' }
}

function ip() {
	let schema = Joi.string().ip();
	let result = schema.validate("127.0.0.1");
	console.log(result);//{ error: null, value: '127.0.0.1' }
	result = schema.validate("127.0.0.512");
	console.log(result.error.message);//"value" must be a valid ip address with a optional CIDR
}

function uri() {
	let schema = Joi.string().uri();
	let result = schema.validate("http://www.baidu.com");
	console.log(result);//{ error: null, value: 'http://www.baidu.com' }
	result = schema.validate("z.cn");
	console.log(result.error.message);//"value" must be a valid uri
}

function guid() {
	var uuid = require("uuid");
	var GetUuid = function () {
		var buffer = new Array(32);
		uuid.v4(null, buffer, 0);
		var string = uuid.unparse(buffer);
		string = string.replace(/-/g, "");
		return string;
	};
	let schema = Joi.string().guid();
	let result = schema.validate(GetUuid());
	console.log(result);//{ error: null, value: '3ad2987bedde461a937590c9584bf551' }
}

function hex() {
	let schema = Joi.string().hex();
	let result = schema.validate("ABCDEF");
	console.log(result);//{ error: null, value: 'ABCDEF' }
	result = schema.validate("ABCDEFZ");
	console.log(result.error.message);//"value" must only contain hexadecimal characters
}

function lowercase() {
	let schema = Joi.string().lowercase();
	let result = schema.validate("ABCD");
	console.log(result);//{ error: null, value: 'abcd' }
	result = schema.validate("abc-123");
	console.log(result);//{ error: null, value: 'abc-123' }
	result = schema.validate("ABCD", {convert: false});
	console.log(result.error.message);//"value" must only contain lowercase characters
}

function uppercase() {
	let schema = Joi.string().uppercase();
	let result = schema.validate("abcd");
	console.log(result);//{ error: null, value: 'ABCD' }
	result = schema.validate("ABC-123");
	console.log(result);//{ error: null, value: 'ABC-123' }
	result = schema.validate("abcd", {convert: false});
	console.log(result.error.message);//"value" must only contain uppercase characters
}

function trim() {
	let schema = Joi.string().trim();
	let result = schema.validate('  ABCD EFG   ');
	console.log(result);//{ error: null, value: 'ABCD EFG' }
	result = schema.validate('  ABCD EFG   ', {convert: false});
	console.log(result.error.message);//"value" must not have leading or trailing whitespace
}

function isoDate() {
	let schema = Joi.string().isoDate();
	let result = schema.validate("2017-01-21 17:06:34");
	console.log(result);//{ error: null, value: '2017-01-21 17:06:34' }
	result = schema.validate(new Date().toLocaleString());
	console.log(result.error.message);//"value" must be a valid ISO 8601 date
}

