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
/*var a = {};
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
 });*/
/*

 let flag = true;
 let schema = {
 a: Joi.any(),
 b: Joi.string().when(flag, {is: true, then: Joi.required()})
 };
 let obj1 = {
 a: "other",
 b: "a"
 };
 let results1 = Joi.validate(obj1, schema);
 console.log(results1.error.message);//child "other" fails because ["other" is required]
 console.log(results1.error.details[0].message);//"other" is required
 */
/*let results1 = Joi.validate("14810776836", Joi.string().regex(/^(\+86){0,1}1[3|4|5|7|8](\d){9}$/));
 console.log(results1);//child "other" fails because ["other" is required]
 console.log(results1.error.message);*/
// console.log(results1.error.details[0].message);//"other" is required
/*let schema = {
 a: Joi.string().required(),
 b: Joi.any().when("a", {is: "AAA", then: Joi.any(), otherwise: Joi.date().timestamp().required()}),
 c: Joi.any().when("a", {is: "AAA", then: Joi.any(), otherwise: Joi.date().timestamp().greater().required()})
 };

 let checkObj = {
 a: "a",
 b: "" + +new Date()
 };

 let results1 = Joi.validate(checkObj, schema);
 console.log(results1);

 function filterJoiErrMsg(err) {
 return (err && err.details && err.details[0] && err.details[0].message) || err.message || err;
 }*/
// https://resource-city.sensoro.com/188db5760db0a5a5acaba8f187ab446f.png
/*
 let schema = {
 sn: Joi.string().min(1).required(),
 name: Joi.string().max(30).allow("")
 };

 let checkObj = {
 sn: "00001",
 name: "safd"
 };

 let results1 = Joi.validate(checkObj, schema);
 console.log(results1);*/

let schema = Joi.object().keys({
	sn: Joi.string(),
	name: Joi.string()
}).or('sn', 'name');      //.min(1)

let a = {};
let checkObj = {
	sn: a.sn,
	name: a.name
};

let results1 = Joi.validate(checkObj, schema);
console.log(results1);