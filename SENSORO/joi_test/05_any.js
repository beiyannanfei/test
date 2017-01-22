/**
 * Created by wyq on 17/1/20.
 */
"use strict";
const language = "en";
const Joi = language == "en" ? require("joi") : require("./language_cn.js");

function any() {
	const any = Joi.any();
	any.validate("a", function (err, value) {
		console.log(arguments);
	});
}

function allow() {
	let schema = Joi.object().keys({
		a: Joi.any().allow("a"),
		b: Joi.any().allow('b', "B"),
		c: Joi.any().allow(['c', 'C'])
	});
	let checkObj = {
		a: "a",
		b: "b",
		c: "c"
	};
	let result1 = Joi.validate(checkObj, schema);
	console.log(result1);//{ error: null, value: { a: 'a', b: 'b', c: 'c' } }
	checkObj.a = "D";
	let result2 = Joi.validate(checkObj, schema); //依旧生效
	console.log(result2);
}

function valid() {  //设置取值范围
	let schema = {
		a: Joi.any().valid("a"),
		b: Joi.any().valid("b", "B"),
		c: Joi.any().valid(["c", "C"])
	};
	let checkObj = {
		a: "a",
		b: "b",
		c: "c"
	};
	let result1 = Joi.validate(checkObj, schema);
	console.log(result1); //{ error: null, value: { a: 'a', b: 'b', c: 'c' } }
	checkObj.c = "D";
	let result2 = Joi.validate(checkObj, schema);
	console.log(result2.error.message); //child "c" fails because ["c" must be one of [c, C]]
	console.log(result2.error.details);
}

function invalid() {  //设置不能取值的范围
	let schema = {
		a: Joi.any().invalid("a"),
		b: Joi.any().invalid("b", "B"),
		c: Joi.any().invalid("c", "C")
	};
	let checkObj = {
		a: "b",
		b: "c",
		c: "d"
	};
	let result1 = Joi.validate(checkObj, schema);
	console.log(result1); //{ error: null, value: { a: 'b', b: 'c', c: 'd' } }
	checkObj.c = "C";
	let result2 = Joi.validate(checkObj, schema);
	console.log(result2.error.message); //child "c" fails because ["c" contains an invalid value]
	console.log(result2.error.details);
}

function required() {
	let schema = {
		a: Joi.any().required()
	};
	let checkObj = {
		b: 1
	};
	let result = Joi.validate(checkObj, schema);
	console.log(result.error.message);//child "a" fails because ["a" is required]
	console.log(result.error.details);
	console.log(result.error.details[0].message); //"a" is required
}

function optional() {
	let schema = {
		a: Joi.any().optional() //相当于占位符,允许undefined值
	};
	let checkObj = {};
	let result1 = Joi.validate(checkObj, schema);
	console.log(result1);//{ error: null, value: {} }
}

function forbidden() {  //用于显示禁止某个key
	let schema = {
		a: Joi.any(),
		b: Joi.any().forbidden()
	};
	let checkObj = {
		a: 1,
		b: 2
	};
	let result = Joi.validate(checkObj, schema, {allowUnknown: true});
	console.log(result.error.message);  //child "b" fails because ["b" is not allowed]
	console.log(result.error.details);
	console.log(result.error.details[0].message); //"b" is not allowed
}

function strip() {  //用于清洁输出(即:删除某个key或数组元素后输出)
	let schema = {
		userName: Joi.string(),
		passWord: Joi.string().strip()
	};
	let checkObj = {
		userName: "AAA",
		passWord: "***"
	};
	let result = Joi.validate(checkObj, schema);
	console.log(result);  //{ error: null, value: { userName: 'AAA' } } 删除了passWord
	console.log(checkObj);  //{ userName: 'AAA', passWord: '***' }

	schema = Joi.array().items(Joi.string(), Joi.any().strip());
	checkObj = ["one", "two", true, null, 1, {}, []];
	let result1 = Joi.validate(checkObj, schema);
	console.log(result1); //{ error: null, value: [ 'one', 'two' ] }
}

function description() {  //用于描述(没有什么实际意义)
	let schema = Joi.any().description("this key will match anything you give it");
	let checkObj = "AAA";
	let result = Joi.validate(checkObj, schema);
	console.log(result);  //{ error: null, value: 'AAA' }
}

function example() {
	let schema = Joi.string().min(4).example("ABCD");
	let checkObj = "a";
	let results = Joi.validate(checkObj, schema);
	console.log(results.error.message);
	console.log(results.error.details);
}

function unit() { //标识值的单位名称(注: 只是标识,但是不会检测)
	let schema = Joi.number().unit("millisenonds");
	let checkObj = ~~(+new Date() / 1000);
	let results = Joi.validate(checkObj, schema);
	console.log(results);
}

function options() {  //重写validate方法,相当于给validate添加options选项
	let schema = Joi.number().options({convert: false});
	let checkObj = "1"; //不会将数字串转换为数字
	let results = Joi.validate(checkObj, schema);
	console.log(results.error.message);
	console.log(results.error.details);
}

function strict() { //joi严格模式, set options.convert = false
	let schema = Joi.number().strict()
	let checkObj = "1"; //不会将数字串转换为数字
	let results = Joi.validate(checkObj, schema);
	console.log(results.error.message); //"value" must be a number
	console.log(results.error.details);
}

function defaultfun() {
	let generateUsername = context => {
		return context.firstname.toLowerCase() + '-' + context.lastname.toLowerCase();
	};
	generateUsername.description = 'a'; //必须要有这行代码,否则函数报错
	let schema = {
		username: Joi.string().default(generateUsername),
		firstname: Joi.string(),
		lastname: Joi.string(),
		created: Joi.date().default(Date.now, "time of creation"),
		status: Joi.string().default("registered")
	};
	let checkObj = {
		firstname: "hello",
		lastname: "world"
	};
	let result = Joi.validate(checkObj, schema);
	console.log(result.value);//{"firstname":"hello","lastname":"world","username":"hello-world","created":1484894618622,"status":"registered"}
}

function label() {
	let schema = {
		first_name: Joi.string().label("first Name")
	};
	let checkObj = {
		first_name: 1
	};
	let result = Joi.validate(checkObj, schema);
	console.log(result.error.message);//child "first Name" fails because ["first Name" must be a string]
	console.log(result.error.details[0].message);//"first Name" must be a string
}

function raw() {  //输出未经转换的值
	let timestampSchema = Joi.date().timestamp();
	let results1 = timestampSchema.validate("12376834097810");
	console.log(results1);//{ error: null, value: 2362-03-17T09:28:17.810Z }

	let rawTimestampSchema = Joi.date().timestamp().raw();
	let results2 = rawTimestampSchema.validate(12376834097810);
	console.log(results2);  //{ error: null, value: 12376834097810 }
}

function empty() {
	let schema1 = {
		a: Joi.string().empty("") //允许空和任何其他字符串
	};
	let obj1 = {
		a: "",
		b: 1
	};
	let results1 = Joi.validate(obj1, schema1, {allowUnknown: true});
	console.log(results1);//{ error: null, value: { b: 1 } }
	let schema2 = {
		a: Joi.string().empty() //不允许空
	};
	let obj2 = {
		a: ""
	};
	let results2 = Joi.validate(obj2, schema2);
	console.log(results2.error.message);//child "a" fails because ["a" is not allowed to be empty]
	console.log(results2.error.details[0].message);//"a" is not allowed to be empty
}

function error() {
	let schema = {
		a: Joi.string().error(new Error("not string"))
	};
	let checkObj = {
		a: 1
	};
	let results = Joi.validate(checkObj, schema);
	console.log(results.error.message);//not string
}