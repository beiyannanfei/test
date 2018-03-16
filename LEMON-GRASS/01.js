/**
 * Created by wyq on 2018/3/16.
 */
const protoEncode = require("./protobuf");

let f = {
	sequence: 1,
	token: "Af5e789b70210ba59b563f7ce32d59a8d",
	payload: ""
};

let request = {
	"openId": "3fbe1c94fec04b61bc3f1d72fe9d7110",
	"clientVersion": "1.0",
	"telecomOper": "Unity Editor",
	"channel": "guest",
	"mPhone": "MacBookPro14,1",
	"network": "WIFI"
};

let payload = protoEncode.loginEncoder(request);
console.log(payload);
f.payload = payload;
let res = protoEncode.requestEncoder(f);
console.log(res);
