/**
 * Created by wyq on 17/7/27.
 */
"use strict";
const through2 = require("through2");
const csv2 = require("csv2");
const fs = require("fs");

fs.createReadStream("./e0b7833431acbd4a529115c92bcf0b7a.csv")
	.pipe(csv2(/*{separator: "\t"}*/))
	.pipe(through2.obj(function (chunk, enc, cb) {
		// console.log(chunk);
		let dataArr;
		try {
			dataArr = chunk[0].split("\t");
		} catch (e) {
			console.log(e.message, chunk);
		}
		this.push(dataArr);
		return cb();
	}))
	.on("data", data => {
		console.log("====data: %j", data);
	})
	.on("error", err => {
		console.log("=== err: %s", err.message || err);
	})
	.on("end", () => {
		console.log("==== end");
	});