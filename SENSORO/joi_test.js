/**
 * Created by sensoro on 16/8/11.
 */
var Joi = require("joi");

/*
 var schema = Joi.object().keys({
 name: Joi.string().min(1).max(5, 'utf8')
 });

 let checkObj = {
 name: "as df"
 };

 Joi.validate(checkObj, schema, (err, value)=> {
 if (!!err) {
 console.log(err.message);
 }
 console.log(value);
 });
 */

/*
 var schema = Joi.object().keys({
 name: Joi.number().min(1)
 });

 let checkObj = {
 name: "1"
 };

 Joi.validate(checkObj, schema, (err, value)=> {
 if (!!err) {
 console.log(err.message);
 }
 console.log(value);
 });
 */

/*var schema = Joi.object().keys({
 info: Joi.array().min(1).max(5000).unique((a, b)=> a.shopId == b.shopId).items(Joi.object().keys({
 name: Joi.string().min(1).required()
 }))
 });

 let checkObj = {
 info: [{shopId: "001", name: "a"}, {shopId: "002", name: "a"}, {shopId: "003", name: "a"}]
 };*/

/*var schema = Joi.object().keys({
 a: Joi.number().valid([1, 2, 3]),
 b: Joi.string().when('a', {is: [1, 2, 3], then: Joi.required()})
 });

 var checkObj = {
 a: 3,
 b: "asdf"
 };*/

var schema = Joi.object().keys({
	a: Joi.number(),
	b: Joi.string().when('a', {is: [1, 2, 3], then: Joi.required()})
});

var checkObj = {
	a: 3
};

Joi.validate(checkObj, schema, (err, value)=> {
	if (!!err) {
		return console.log(err.message);
	}
	console.log(value);
});

