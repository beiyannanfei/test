/**
 * Created by wyq on 17/5/18.
 * 使用baidu-ocr-api库实现识别图片为文本(中文准确率很好英文错误率较高)
 */
const path = require("path");
const ak = "c3285f70010d40299983d23d123a18d7";
const sk = "21b3eb72df5643868287de4a1d2129b1";
const ocr = require('baidu-ocr-api').create(ak, sk);

let filePath = path.join(__dirname, "b.png");

ocr.scan({
	url: filePath,
	type: "line", //text line character
	language: "CHN" //CHE_ENG CHE ENG
}).then(val => {
	console.log(JSON.stringify(val));
}).catch(err => {
	console.log("err: %j", err.m || err);
});

