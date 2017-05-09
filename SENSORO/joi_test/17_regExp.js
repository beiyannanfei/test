/**
 * Created by wyq on 17/5/9.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

let schema = Joi.string().regex(/^[0-5]\d:[0-5]\d$/);
let checkObj = "60:20";

var result = Joi.validate(checkObj, schema, {allowUnknown: true});
if (result.error) {
	return console.log(filterJoiErrMsg(result.error));
}
console.log(result);

function filterJoiErrMsg(err) {
	return (err && err.details && err.details[0] && err.details[0].message) || err.message || err;
}