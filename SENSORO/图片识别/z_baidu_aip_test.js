/**
 * Created by wyq on 18/1/15.
 */
const AppID = "10691901";
const APIKey = "EnFieqEHl59lvCVGRKwNGUgo";
const SecretKey = "Ua9DG5cCxPVO9LTrRLjTyPHWM7T0CcwH";
const AipOcrClient = require("baidu-aip-sdk").ocr;
const fs = require("fs");
const client = new AipOcrClient(AppID, APIKey, SecretKey);

function t1() { //通用文字识别
	const imageBuf = fs.readFileSync("./b.jpg").toString("base64");
	client.generalBasic(imageBuf).then(function (result) {
		return console.log(JSON.stringify(result));
		let str = "";
		result.words_result.forEach(e => {
			str += e.words;
		});
		console.log(str);
	}).catch(function (err) {
		// 如果发生网络错误
		console.log(err);
	});
}

function t2() { //生僻字识别(收费)
	const image = fs.readFileSync("./d.jpg").toString("base64");
	let options = {};
	options["language_type"] = "CHN_ENG";
	options["detect_direction"] = "true";
	options["detect_language"] = "true";
	options["probability"] = "true";

	client.generalEnhance(image, options).then(function (result) {
		console.log(JSON.stringify(result));
	}).catch(function (err) {
		// 如果发生网络错误
		console.log(err);
	});
}

function t3() { //身份证识别
	let image = fs.readFileSync("./f.jpg").toString("base64");
	let idCardSide = "front";
	client.idcard(image, idCardSide).then(function (result) {
		console.log(JSON.stringify(result));
	}).catch(function (err) {
		console.log(err);
	});
}



