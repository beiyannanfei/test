/**
 * Created by wyq on 17/1/22.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function date() {
	let schema = Joi.date();
	let result = schema.validate("01-01-2017");
	console.log(result);//{ error: null, value: 2016-12-31T16:00:00.000Z }
	result = schema.validate("2017-01-02");
	console.log(result);//{ error: null, value: 2017-01-02T00:00:00.000Z }
	result = schema.validate(new Date());
	console.log(result);//{ error: null, value: 2017-01-22T03:07:31.984Z }
}

function min() {
	let schema = Joi.date().min("2017-01-01");
	let result = schema.validate("2016-12-31");
	console.log(result.error.message);//"value" must be larger than or equal to "Sun Jan 01 2017 08:00:00 GMT+0800 (CST)"
	schema = Joi.date().min("now");
	result = schema.validate("2016-12-31");
	console.log(result.error.message);//"value" must be larger than or equal to "Sun Jan 22 2017 11:12:07 GMT+0800 (CST)"
	result = schema.validate(new Date());
	console.log(result);  //{ error: null, value: 2017-01-22T03:12:40.966Z }
	schema = Joi.object({
		from: Joi.date().required(),
		to: Joi.date().min(Joi.ref("from")).required()
	});
	result = schema.validate({from: "2016-12-12 12:12:12", to: "2016-12-12 12:12:11"});
	console.log(result.error.message);//child "to" fails because ["to" must be larger than or equal to "Mon Dec 12 2016 12:12:12 GMT+0800 (CST)"]
	console.log(result.error.details[0].message);//"to" must be larger than or equal to "Mon Dec 12 2016 12:12:12 GMT+0800 (CST)"
}

function max() {
	let schema = Joi.object({
		from: Joi.date().max(Joi.ref("to")).required(),
		to: Joi.date().required()
	});
	let result = schema.validate({from: "2016-12-12 12:12:12", to: "2016-12-12 12:12:11"});
	console.log(result.error.message);//child "from" fails because ["from" must be less than or equal to "Mon Dec 12 2016 12:12:11 GMT+0800 (CST)"]
	console.log(result.error.details[0].message);//"from" must be less than or equal to "Mon Dec 12 2016 12:12:11 GMT+0800 (CST)"
}

function timestamp() {
	let schema = Joi.date().timestamp();    //默认是js时间戳(毫秒级)
	let result = schema.validate(+new Date());
	console.log(result); //{ error: null, value: 2017-01-22T03:27:35.570Z }
	result = schema.validate("2017-12-12");
	console.log(result.error.message);//"value" must be a valid timestamp or number of milliseconds
	console.log(result.error.details[0].message + "\n==============");//"value" must be a valid timestamp or number of milliseconds
	schema = Joi.date().timestamp("javascript");  //同默认
	result = schema.validate(+new Date());
	console.log(result);//{ error: null, value: 2017-01-22T03:31:36.542Z }
	schema = Joi.date().timestamp("unix");  //秒级时间戳
	result = schema.validate(~~(+new Date() / 1000));
	console.log(result);//{ error: null, value: 2017-01-22T03:32:30.000Z }
}
