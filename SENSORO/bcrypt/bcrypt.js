/**
 * Created by wyq on 17/3/29.
 */
"use strict";
const bcrypt = require('bcrypt');
let pwd = '$2a$04$fviiDpvl.ae7.whPgrI6YuiX7H5axqtdBQeT23T6EnYYGfUYiOGz.';

function t1() {
	bcrypt.hash("g1xfaa3IovQUrB1DCn", 1, function (err, hash) {
		console.log(arguments);//注意: 没事生成的密码都会变化
	});
}

function t2() {
	bcrypt.compare("123456", pwd, function (err, isMatch) {
		console.log(arguments);
	});
}

t1();


/*
* {
 "_id" : ObjectId("59e566ebfbcd846b1d571271"),
 "userName" : "13812348888",
 "grantRoles" : ObjectId("59c32a3e1f097d206db3c64e"),
 "users" : ObjectId("590bfad00771ed116b1df421"),
 "contacts" : "17600189910",
 "contactName" : "齐哲",
 "createdTime" : ISODate("2017-10-17T02:11:55.736Z"),
 "loginTime" : ISODate("2017-12-06T13:06:25.135Z"),
 "indexTags" : [
 "13812348888",
 "齐哲",
 "Demo系统管理员"
 ],
 "isStop" : false,
 "isManage" : true,
 "isDeleted" : false,
 "roles" : "admin",
 "__v" : 3,
 "password" : "$2a$04$/mr/dGeVIwJThANiH3wkGO2uDlKD6jiG1mQfiWAiNKBYMKlGpRt1C",
 "nickname" : "Demo系统管理员"
 }
* */
