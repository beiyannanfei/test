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

/*
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
 });*/

/*
 var a = {
 a: ["1", "2", "3"],
 b: ["4", "6", "6"],
 c: ["7", "8", "9"],
 d: []
 };

 let aScheam = {};
 for (var index in a) {
 aScheam[index] = Joi.array().min(0).unique().items(Joi.string().min(1)).required();
 }
 let schema = Joi.object().keys({
 a: Joi.object().keys(aScheam)
 });

 let checkObj = {
 a: a
 };
 */

/*
 let schema = Joi.object().keys({
 a: Joi.number().min(0).required()
 });

 let checkObj = {
 a: "a"
 };


 Joi.validate(checkObj, schema, (err, value)=> {
 if (!!err) {
 console.log(err.message);
 var msgList = err.message.split("because ");
 console.log(msgList);
 var errDesc = msgList[1];
 console.log(errDesc);
 var m1 = errDesc.split("\" ");
 console.log(m1[0]);
 console.log(m1[1]);
 var arg = m1[0].substr(2, m1[0].length - 2);
 console.log(arg);
 var errmsg = m1[1].substr(0, m1[1].length - 1);
 console.log(errmsg);
 }
 });*/

// 大凡媚上者多傲下
//一个汉字的utf8编码占3个字节
/*var schema = Joi.object().keys({
 name: Joi.string().min(1).max(7, 'utf8')
 });

 let checkObj = {
 name: "你好aa"
 };*/
/*

 var schema = Joi.object().keys({
 obj: Joi.object().keys({
 type: Joi.string().min(1).required()
 }).required(),
 msg: Joi.string().min(1).max(100).when("obj.type", {is: "a", then: Joi.required()})
 });

 var checkObj = {
 obj:{
 type: "a"
 },
 msg: "asdf"
 };
 */
/*
 var schema = Joi.object().keys({
 type: Joi.string().min(1).required(),
 obj: Joi.object().keys({
 msg1: Joi.string().min(1),
 msg2: Joi.string().min(1)
 }).required().when(
 "type", {is: "GROUPON1", then: Joi.object({msg1: Joi.required()})}
 ).when(
 "type", {is: "GROUPON2", then: Joi.object({msg2: Joi.required()})}
 )
 });

 var checkObj = {
 type: "GROUPON",
 obj: {}
 };*/

var schema = Joi.object().keys({
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
};

Joi.validate(checkObj, schema, (err, value)=> {
	if (!!err) {
		console.log("name: %j", err.name);
		console.log("isJoi: %j", err.isJoi);
		console.log("message: %j", err.message);
		console.log("path: %j", err.path);
		console.log("type: %j", err.type);
		console.log("context: %j", err.context);
		return;
	}
	console.log(value);
});



