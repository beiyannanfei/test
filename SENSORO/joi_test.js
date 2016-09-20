/**
 * Created by sensoro on 16/8/11.
 */
var Joi = require("joi");

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

