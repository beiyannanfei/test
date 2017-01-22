/**
 * Created by wyq on 17/1/19.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

try {
	Joi.assert("x", Joi.number(), "err_test: ");
} catch (e) {
	console.log(e.message || e);
}
