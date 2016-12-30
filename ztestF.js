/*

 Hi Marc,
 Hope this email finds you well.I'm glad to introduce you to my work.
 I have been responsible for WeChat payment since I entered the company,
 and it will be completed in April next year.If you have any questions
 please send e-mail to me and Andy at any time.Andy or me will reply
 the mail as soon as possible.
 Also, do you think it's necessary to organize a conference call every week
 or every two weeks to discuss recent problems and solutions?
 I am looking forward to your answers.
 Best regards,
 Beiyannanfei

 */

// 祝福大家在新的一年好运连连,财运滚滚

var Promise = require("bluebird");
var a = function (param) {
	return new Promise((resolve, reject) => {
		return resolve("a" + param);
	});
};

var b = function (param) {
	return new Promise((resolve, reject) => {
		return resolve("b" + param);
	});
};

var type = 1;

var myF = type ? a : b;

myF(1).then(val => {
	console.log(val);
	var t = "asdfasdf";
	var t1;
	try {
		t1 = JSON.parse(t);
	} catch (e) {
		console.log(e.message);
	}
	console.log("t1: %j", t1);
});













水中花






