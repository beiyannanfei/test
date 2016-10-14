"use strict";
var Rx = require("rx");

var validate = {
	"mobile": Rx.Observable.return("123-456-789"),
	"email": Rx.Observable.return("abc@def.com")
};

var emptyObserable = Rx.Observable.empty();

Rx.Observable.case(() => "mobile", validate, emptyObserable)
	.subscribe(mobile => {
		console.log("mobile: %j", mobile);
	});

Rx.Observable.case(() => "email", validate, emptyObserable)
	.subscribe(email => {
		console.log("email: %j", email);
	});