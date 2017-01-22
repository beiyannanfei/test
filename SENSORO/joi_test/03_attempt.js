/**
 * Created by wyq on 17/1/19.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

try {
	Joi.attempt("x", Joi.number(), "err_test: ");
} catch (e) {
	console.log(e.message || e);  //err_test:  "value" must be a number
}
const result = Joi.attempt("4", Joi.number());
console.log(result);  //4
