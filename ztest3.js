/*var a = {
 4010071: "deleteCard|getCards|getCard|getColors", //-- Wechat throw error
 4010077: "updateCard|createCard|updateCardStock",
 4010152: "createTaskCard",
 4010151: "receiveTaskCard"

 修改同步其他公众号卡券、删除卡券接口
 修改获取卡券详情接口
 };*/


//activateMembercardUserForm ???  getMembercard   getActivatetTempInfo    activateMembercard
//updateMembercard  updateCard  addMemberCardPaygift  deleteMemberCardPaygift  getMemberCardPaygift

"use strict";
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var _ = require("lodash");
var dataClean = function (data) {
	console.log("=== %j", data);
	if (!_.isObject(data) || _.isArray(data) || data instanceof ObjectId) {
		return;
	}
	for (var k in data) {
		var val = data[k];
		if (_.isArray(val)) {
			data[k] = _.filter(val, function (item) {
				return item !== null && item !== undefined && item !== '';
			});
		} else if (val === null || val === undefined || val === '') {
			if (_.isArray(data)) {
				data.splice(k, 1);
			} else {
				delete data[k];
			}
		} else if (_.isObject(data[k])) {
			dataClean(data[k]);
		}
	}
};

var data = {
	card_type: 'MEMBER_CARD',
	base_info: {
		logo_url: 'http://mmbiz.qpic.cn/mmbiz/iaL1LJM1mF9aRKPZ/0',
		brand_name: '海底捞',
		code_type: 'CODE_TYPE_TEXT',
		title: '海底捞会员卡',
		color: 'Color010',
		notice: '使用时向服务员出示此券',
		service_phone: '020-88888888',
		description: '不可与其他优惠同享',
		date_info: {type: 'DATE_TYPE_PERMANENT'},
		sku: {quantity: 50000000},
		get_limit: 3,
		use_custom_code: false,
		can_give_friend: true,
		location_id_list: [123, 12321],
		custom_url_name: '立即使用',
		custom_url: 'http://weixin.qq.com',
		custom_url_sub_title: '6个汉字tips',
		promotion_url_name: '营销入口1',
		promotion_url: 'http://www.qq.com',
		need_push_on_view: true
	},
	member_info: {
		background_pic_url: 'https://mmbiz.qlogo.cn/mmbiz/',
		supply_bonus: true,
		supply_balance: false,
		prerogative: 'test_prerogative',
		auto_activate: true,
		custom_field1: {name_type: 'FIELD_NAME_TYPE_LEVEL', url: 'http://www.qq.com'},
		activate_url: 'http://www.qq.com',
		custom_cell1: {name: '使用入口2', tips: '激活后显示', url: 'http://www.xxx.com'},
		bonus_rule: {
			cost_money_unit: 100,
			increase_bonus: 1,
			max_increase_bonus: 200,
			init_increase_bonus: 10,
			cost_bonus_unit: 5,
			reduce_money: 100,
			least_money_to_use_bonus: 1000,
			max_reduce_bonus: 50
		},
		discount: 10
	},
	uid: new ObjectId(),
	appid: 'wxf9279cfe83db3222'
};
dataClean(data);




/*
var _id = new ObjectId();
console.log(_id); //生成一个_id
console.log(typeof _id);
console.log({} instanceof mongoose.Types.ObjectId);*/
