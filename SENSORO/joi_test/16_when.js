/**
 * Created by wyq on 17/5/9.
 */
var Joi = require("./language_cn.js");

var schema = {
	srcData: Joi.object().keys({
		type: Joi.string().valid(["circle", "rect"]).required(),
		lat: Joi.when("type", {
			is: "circle", then: Joi.number().required(), otherwise: Joi.object().keys({
				min: Joi.number().required(),
				max: Joi.number().required()
			}).required()
		}),  //lat: {max: "", min: ""}
		lng: Joi.when("type", {
			is: "circle", then: Joi.number().required(), otherwise: Joi.object().keys({
				min: Joi.number().required(),
				max: Joi.number().required()
			}).required()
		}),  //lat: {max: "", min: ""}
		radius: Joi.number().when("type", {is: "circle", then: Joi.required()}),
	}).required()
};

var checkObj = {
	srcData: {
		type: "rect",
		lat: {
			min: 1,
			max: 2
		},
		lng: {
			min: 3,
			max: 4
		},
		radius: 123
	}
};

var result = Joi.validate(checkObj, schema, {allowUnknown: true});
if (result.error) {
	return console.log(filterJoiErrMsg(result.error));
}
console.log(result);

function filterJoiErrMsg(err) {
	return (err && err.details && err.details[0] && err.details[0].message) || err.message || err;
}