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

var schema = Joi.object().keys({
	info: Joi.array().min(1).max(5000).unique((a, b)=> a.shopId == b.shopId).items(Joi.object().keys({
		name: Joi.string().min(1).required()
	}))
});

let checkObj = {
	info: [{shopId: "001", name: "a"}, {shopId: "002", name: "a"}, {shopId: "003", name: "a"}]
};

Joi.validate(checkObj, schema, (err, value)=> {
	if (!!err) {
		console.log(err.message);
	}
	console.log(value);
});

