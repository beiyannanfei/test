/**
 * Created by wyq on 17/3/29.
 */
"use strict";
const bcrypt = require('bcrypt');
let pwd = '$2a$04$oLKt1sKXpePxf4PtRX5WquLZ6q51ge8OQse9TXc0LBjdUwvlX9Nvu';

function t1() {
	bcrypt.hash("e88ea50c12", 1, function (err, hash) {
		console.log(arguments);//注意: 没事生成的密码都会变化
	});
}

function t2() {
	bcrypt.compare("e88ea50c12", pwd, function (err, isMatch) {
		console.log(arguments);
	});
}

t2();



