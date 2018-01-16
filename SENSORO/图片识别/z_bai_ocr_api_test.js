/**
 * Created by wyq on 18/1/15.
 */
const AppID = "10691901";
const APIKey = "EnFieqEHl59lvCVGRKwNGUgo";
const SecretKey = "Ua9DG5cCxPVO9LTrRLjTyPHWM7T0CcwH";
const url = "https://aip.baidubce.com/oauth/2.0/token";
const request = require('superagent');
const fs = require("fs");

let httpPost = exports.httpPost = function (url, param, cb) {
	request.post(url)
		.type('application/x-www-form-urlencoded')
		.send(param)
		.timeout(20000)
		.accept('text/json')
		.end(function (err, xhr) {
			if (err) {
				return cb(err);
			}
			if (xhr.statusCode == 200) {
				if (xhr.text) {
					let body;
					try {
						body = JSON.parse(xhr.text);
					}
					catch (e) {
						body = xhr.text
					}
					cb(null, body);
				}
				else {
					cb('response has not content');
				}
			}
			else {
				cb(xhr.statusCode);
			}
		});
};

function getToken() {
	httpPost(url, {
		grant_type: "client_credentials",
		client_id: APIKey,
		client_secret: SecretKey
	}, function (err, response) {
		if (!!err) {
			return console.log("getToken err: %j", err.message || err);
		}
		console.log("response: %j", response);
		response = {
			"access_token": "24.3b7ff0e0c29d7c96c8351d102f2b98cf.2592000.1518578645.282335-10691901",
			"session_key": "9mzdCKYm0PHuc/esFjqJwQ7asGJH8VpOTsiSUp3zef34hD/kwTkOQjUjZ59hj4gNJFAkamfD4ckPMQd/3h59h42nmJIo+Q==",
			"scope": "public vis-ocr_ocr brain_ocr_scope brain_ocr_general brain_ocr_general_basic brain_ocr_general_enhanced vis-ocr_business_license brain_ocr_webimage brain_all_scope brain_ocr_idcard brain_ocr_driving_license brain_ocr_vehicle_license vis-ocr_plate_number brain_solution brain_ocr_plate_number brain_ocr_accurate brain_ocr_accurate_basic brain_ocr_receipt brain_ocr_business_license wise_adapt lebo_resource_base lightservice_public hetu_basic lightcms_map_poi kaidian_kaidian ApsMisTest_Test权限 vis-classify_flower bnstest_fasf lpq_开放 cop_helloScope ApsMis_fangdi_permission",
			"refresh_token": "25.6166f1564bbdd2cbfa4ba3374f8a052e.315360000.1831346645.282335-10691901",
			"session_secret": "3c19b15ee4f11b63ae4a23f9e337d136",
			"expires_in": 2592000
		};
	});
}

function distinguish() {    //识别
	const url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic";
	const access_token = "24.3b7ff0e0c29d7c96c8351d102f2b98cf.2592000.1518578645.282335-10691901";
	const imageBuf = fs.readFileSync("./b.png").toString("base64");
	request.post(`${url}?access_token=${access_token}`)
		.type('application/x-www-form-urlencoded')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.send({image: imageBuf})
		.timeout(20000)
		.accept('text/json')
		.end(function (err, xhr) {
			if (err) {
				return console.log("err: ", err.message || err);
			}
			if (xhr.statusCode == 200) {
				if (xhr.text) {
					let body;
					try {
						body = JSON.parse(xhr.text);
					}
					catch (e) {
						body = xhr.text
					}
					return console.log("body: %j", body);
				}
				else {
					return console.log('response has not content');
				}
			}
			else {
				return console.log("statusCode: %j", xhr.statusCode);
			}
		});
}

function speech() {   //文字转语音
	const appId = "10695135";
	const apiKey = "WkPLOuQd3rgoVy9t8Gg1pUFM";
	const secretKey = "Gkl7XWI9A5yWOnW0I8BszNYXQd4EUn9i";

	const AipSpeechClient = require("baidu-aip-sdk").speech;
	const client = new AipSpeechClient(appId, apiKey, secretKey);
	//api地址：http://ai.baidu.com/docs#/TTS-Online-Node-SDK/6e8f50ff
	client.text2audio("合成文本长度必须小于1024字节，如果本文长度较长，可以采用多次请求的方式。不可文本长度超过限制").then(res => {
		if (res && res.data) {
			return fs.writeFileSync("/Users/sensoro/Desktop/tttt.mp3", res.data);
		}
		return console.log("res: %j", res);
	}).catch(e => {
		return console.log("e: %j", e.message || e);
	});
}

speech();



