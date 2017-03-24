/**
 * Created by wyq on 17/1/15.
 */
var Joi = require("./language_cn.js");
var _ = require("lodash");

/*var schema = Joi.object().keys({
 a: Joi.number()
 });

 var checkObj = {
 a: "abcdef"
 };*/
/*var schema = Joi.object().keys({
 type: Joi.string().min(1).required(),
 advanced_info: Joi.object().keys({
 text_image_list: Joi.array().items(Joi.object().keys({
 image_url: Joi.string().min(1).max(128),
 text: Joi.string().min(1).max(512),
 }))
 }).when("type", {is: "GENERAL_COUPON", then: Joi.object({text_image_list: Joi.array().min(1).required()}).required()})
 });

 var checkObj = {
 type: "GENERAL_COUPON",
 advanced_info: {
 text_image_list: []
 }
 };*/
/*var o = {};

 var schema = Joi.object().keys({
 type: Joi.object().keys({
 a: Joi.number()
 }).required()
 });

 var checkObj = {
 type: {
 a: 10,
 b: o.b
 }
 };*/
var a = {};
let schema = Joi.object().keys({
	name: Joi.string().max(50),
	applyType: Joi.array().items(Joi.string().valid([1, 2, 3]))
});
let checkObj = {
	name: a.name,
	applyType: [1, 2]
};
let error = Joi.validate(checkObj, schema);
return console.log(error);

schema = Joi.object().keys({
	name: Joi.string().min(1).max(20)
});

checkObj = {
	name: ""
};

var result = Joi.validate(checkObj, schema);
if (result.error) {
	return console.log(filterJoiErrMsg(result.error));
}
return console.log(result);

Joi.validate(checkObj, schema, {allowUnknown: true}, (err, value)=> {
	if (!!err) {
		console.log(filterJoiErrMsg(err));
		// console.log(err.details[0].message);
		// console.log(err);
		return
	}
	console.log(value);
});


function filterJoiErrMsg(err) {
	return (err && err.details && err.details[0] && err.details[0].message) || err.message || err;
}

