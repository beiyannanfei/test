/**
 * Created by wyq on 17/4/26.
 * 微信公共平台加解密库
 */
"use strict";
const MsgCrypt = require("wechat-crypto");
const _ = require("lodash");

let config = {
	appSecret: "abc123",
	appKey: "4z04NBTlokkUjNZHK9WCfPPquYzkChtiRYHU4BHkHpf",    //必须为43位长度
	appId: "cde7890"
};
let msg = "wangyanqiang";
let crypter = new MsgCrypt(config.appSecret, config.appKey, config.appId);
let encrypted = crypter.encrypt(msg);   //每次加密后的值不同
console.log("encrypted: %j", encrypted);
let decrypted = crypter.decrypt(encrypted);
console.log(decrypted);   //{ message: 'wangyanqiang', id: 'cde789' }









