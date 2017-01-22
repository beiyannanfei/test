/**
 * Created by wyq on 17/1/20.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function when1() {
	let schema = {
		a: Joi.valid('a', 'b', 'other'),
		other: Joi.string().when('a', {is: "other", then: Joi.required()})
	};
	let obj1 = {
		a: "other"
	};
	let obj2 = {
		a: "other",
		other: "test"
	};
	let results1 = Joi.validate(obj1, schema);
	console.log(results1.error.message);//child "other" fails because ["other" is required]
	console.log(results1.error.details[0].message);//"other" is required
}

function when2() {
	let schema = {
		a: Joi.any().valid("x").when("b", {is: 5, then: Joi.valid("y"), otherwise: Joi.valid("z")}),
		b: Joi.any()
	};
	let obj1 = {
		a: "z0",
		b: 10
	};
	let results1 = Joi.validate(obj1, schema);
	console.log(results1.error.message);//child "a" fails because ["a" must be one of [x, z]]
	console.log(results1.error.details[0].message);//"a" must be one of [x, z]
	obj1 = {
		a: "y",
		b: 5
	};
	let results2 = Joi.validate(obj1, schema);
	console.log(results2);//{ error: null, value: { a: 'y', b: 5 } }
}

function when3() {
	let schema = {
		a: Joi.boolean().required(),
		b: Joi.object().keys({
			c: Joi.string(),
			d: Joi.number().required()
		}).required().when("a", {
			is: true,
			then: Joi.object({c: Joi.required()})
		})
	};
	let checkObj = {
		a: true,
		b: {
			d: 123
		}
	};
	let results = Joi.validate(checkObj, schema);
	console.log(results.error.message);//child "b" fails because [child "c" fails because ["c" is required]]
	console.log(results.error.details[0].message);//"c" is required
}


