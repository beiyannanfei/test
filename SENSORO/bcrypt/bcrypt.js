/**
 * Created by wyq on 17/3/29.
 */
"use strict";
const bcrypt = require('bcrypt');
let pwd = '$2a$04$fviiDpvl.ae7.whPgrI6YuiX7H5axqtdBQeT23T6EnYYGfUYiOGz.';

function t1() {
	bcrypt.hash("123456", 1, function (err, hash) {
		console.log(arguments);//注意: 没事生成的密码都会变化
	});
}

function t2() {
	bcrypt.compare("123456", pwd, function (err, isMatch) {
		console.log(arguments);
	});
}

t1();



