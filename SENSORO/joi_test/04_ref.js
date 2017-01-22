/**
 * Created by wyq on 17/1/19.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

let schema = Joi.object().keys({
	a: Joi.ref("b.c"),
	b: {
		c: Joi.any()
	},
	c: Joi.ref("$x")
});

let checkObj = {
	a: 5,
	b: {
		c: 5
	}
};

let result1 = Joi.validate(checkObj, schema, {context: {x: 5}});
console.log(result1);
checkObj.a = 6;
let result2 = Joi.validate(checkObj, schema, {context: {x: 5}});
console.log(result2.error.message);
console.log(result2.error.details);

