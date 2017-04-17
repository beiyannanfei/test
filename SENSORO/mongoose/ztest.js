/**
 * Created by wyq on 17/4/17.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/tracker-api");
const Schema = mongoose.Schema;

let t1Schema = new Schema({
	sn: {type: String, required: true},                           //设备编号
	devices: {type: mongoose.Schema.Types.ObjectId, ref: 'Device'},//设备_id
	users: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},   //用户id
	status: {type: Number, enum: [1, 2], default: 0},       //状态
	lonlat: {type: [Number]},                                     //地理位置(经纬度)
	createTime: {type: Date, default: Date.now, expires: "150d"}  //创建时间(数据保留5个月)
});

let t1Model = mongoose.model("motionlog", t1Schema);


var doc = {
	"sn": "a000000001",
	"devices": "58f4743aecdead4d90776af8",
	"users": "58eafb50ecdead4d9075637c",
	"status": 1,
	"lonlat": [
		10.123,
		20.456
	],
	"createTime": new Date()
};

t1Model.create(doc).then(val => {
	console.log(val);
});