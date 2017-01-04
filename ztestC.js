module.exports = {
	//错误码对应关系
	"-1": {cn: "系统错误", en: "System error", errcode: -1},
	"-2": {cn: "没有权限", en: "No permission", errcode: -2},
	//授权相关
	"user_auth-no_permission": {cn: "没有权限", en: "", errcode: -2},
	"user_auth-account_locked": {cn: "账号被停用", en: "", errcode: 4010017},
	"user_auth-user_overdue": {cn: "用户已过期", en: "", errcode: 4010026},
	"user_auth-not_bind_wechat": {cn: "此账号没有绑定公众号", en: "", errcode: 4010063},
	"user_auth-not_bind_wxmch": {cn: "未绑定商户信息", en: "", errcode: 4010101},

	//获取原有卡券
	"card_get-card_null": {cn: "卡券不存在", en: "", errcode: 4010076},

	//卡券颜色相关
	"card_color-appid_null": {cn: "参数appid为空", en: "", errcode: 4010071},
	"card_color-api_error": {cn: "获取卡券颜色接口错误", en: "", errcode: 4010071},

	//添加卡券相关
	"card_add-card_type_null": {cn: "卡券类型字段为空", en: "", errcode: 4010078},
	"card_add-base_info_null": {cn: "卡券基本信息字段为空", en: "", errcode: 4010078},
	"card_add-member_info_null": {cn: "会员卡信息字段为空", en: "", errcode: 4010078},
	"card_add-special_info_null": {cn: "卡券自定义信息字段为空", en: "", errcode: 4010078},
	"card_add-color_null": {cn: "卡券颜色字段为空", en: "", errcode: 4010078},
	"card_add-logo_url_null": {cn: "卡券logo字段为空", en: "", errcode: 4010078},
	"card_add-brand_name_null": {cn: "卡券商户名字字段为空", en: "", errcode: 4010078},
	"card_add-title_null": {cn: "卡券名字字段为空", en: "", errcode: 4010078},
	"card_add-notice_null": {cn: "卡券使用提醒字段为空", en: "", errcode: 4010078},
	"card_add-description_null": {cn: "卡券使用说明字段为空", en: "", errcode: 4010078},
	"card_add-sku_null": {cn: "卡券商品信息字段为空", en: "", errcode: 4010078},
	"card_add-sku.quantity_null": {cn: "卡券库存的数量字段为空", en: "", errcode: 4010078},
	"card_add-date_info_null": {cn: "卡券使用日期字段为空", en: "", errcode: 4010078},
	"card_add-date_info.type_null": {cn: "卡券使用时间的类型字段为空", en: "", errcode: 4010078},
	"card_add-deal_detail_null": {cn: "团购详情字段为空", en: "", errcode: 4010078},
	"card_add-reduce_cost_null": {cn: "减免金额字段为空", en: "", errcode: 4010078},
	"card_add-discount_null": {cn: "打折额度字段为空", en: "", errcode: 4010078},
	"card_add-gift_null": {cn: "兑换内容名称字段为空", en: "", errcode: 4010078},
	"card_add-default_detail_null": {cn: "优惠详情字段为空", en: "", errcode: 4010078},
	"card_add-activate_url_null": {cn: "激活会员卡url字段为空", en: "", errcode: 4010078},
	"card_add-supply_balance_null": {cn: "是否支持储值字段为空", en: "", errcode: 4010078},
	"card_add-prerogative_null": {cn: "会员卡特权说明字段为空", en: "", errcode: 4010078},
	"card_add-abstract_null": {cn: "封面摘要简介字段为空", en: "", errcode: 4010078},
	"card_add-icon_url_list_null": {cn: "封面图片列表字段为空", en: "", errcode: 4010078},
	"card_add-text_image_list_null": {cn: "图文列表字段为空", en: "", errcode: 4010078},

	//修改卡券相关
	"card_modify-data_empty": {cn: "修改数据为空", en: "", errcode: 4010094},
	"card_modify-forbid_modify": {cn: "已审核卡券只能修改base_info字段", en: "", errcode: 4010079},
	"card_modify-updateCard_api_error": {cn: "更新卡券微信接口返回错误", en: "", errcode: 4010077},

	//卡券库存相关
	"card_quantity-quantity_invalid": {cn: "卡券库存量需大于0", en: "", errcode: 4010080},
	"card_quantity-api_error": {cn: "修改卡券微信端库存接口错误", en: "", errcode: 4010077},

	//修改 应用 对卡券的需求量(接口作废)
	//导入code接口相关
	"card_code_import-card_id_invalid": {cn: "卡券ID字段为空", en: "", errcode: 4010075},
	"card_code_import-code_list_null": {cn: "导入卡券code列表为空", en: "", errcode: 4010083},
	"card_code_import-code_list_too_large": {cn: "导入卡券code列表太大", en: "", errcode: 4010084},
	"card_code_import-code_repeat": {cn: "导入卡券code列表有重复", en: "", errcode: 4010088},
	"card_code_import-code_length_invalid": {cn: "导入卡券code长度非法", en: "", errcode: 4010083},
	"card_code_import-card_status_invalid": {cn: "卡券状态不合法", en: "", errcode: 4010086},
	"card_code_import-code_import_repeat": {cn: "重复导入", en: "", errcode: 4010087},
	"card_code_import-code_import_faild": {cn: "卡券导入失败", en: "", errcode: 4010085},

	//获取卡券列表相关
	"card_list-per_page_num_large": {cn: "单页数据条数超限", en: "", errcode: 4010001},

	//同步卡券相关
	"card_sync-card_id_invalid": {cn: "卡券ID字段为空", en: "", errcode: 4010075},
	"card_sync-card_date_invalid": {cn: "卡券日期字段为空", en: "", errcode: 4010082},
	"card_sync-sync_api_error": {cn: "创建微信卡券失败", en: "", errcode: 4010077},

	//同步公众号卡券到本地
	"card_sync_local-getCardList_api_error": {cn: "获取卡券列表接口错误", en: "", errcode: 4010071},
	"card_sync_local-cardInfo_api_error": {cn: "获取卡券详情接口错误", en: "", errcode: 4010071},

	//同步其它公众号卡券相关
	"card_sync_admin-query_param_invalid": {cn: "查询参数错误", en: "", errcode: 4010091},
	"card_sync_admin-query_info_null": {cn: "查询内容错误", en: "", errcode: 4010091},

	//删除卡券相关
	"card_del-card_null": {cn: "删除的卡券不存在", en: "", errcode: 4010076},
	"card_del-api_error": {cn: "删除卡券接口错误", en: "", errcode: 4010071},

	//获取卡券详情相关
	"card_detail-appid_null": {cn: "appid参数为空", en: "", errcode: 4010054},
	"card_detail-cardId_null": {cn: "卡券id参数错误", en: "", errcode: 4010075},
	"card_detail-page_count_over": {cn: "每页数据条数超过限制", en: "", errcode: 4010001},

	//卡券发放相关
	"card_issue-card_null": {cn: "发放卡券不存在", en: "", errcode: 4010076},
	"card_issue-card_type_invalid": {cn: "卡券发放时通知数据 type 不合法", en: "", errcode: 4010073},

	//核销卡卷相关
	"card_consume-param_invalid": {cn: "参数错误", en: "", errcode: 4010093},
	"card_consume-failure": {cn: "卡券核销失败", en: "", errcode: 4010081},

	//获取当前卡券的领取人列表相关
	"card_code_list-page_count_over": {cn: "每页数据条数超过限制", en: "", errcode: 4010001},

	//创建互通卡券相关
	"card_cross-param_invalid": {cn: "创建互通卡券参数错误", en: "", errcode: 4010093},
	"card_cross-user_invalid": {cn: "用户不合法，请确定用户已绑定公众号，并且是有效状态", en: "", errcode: 4010020},
	"card_cross-user_overdue": {cn: "用户已过期", en: "", errcode: 4010020},
	"card_cross-api_error": {cn: "互通卡券微信接口错误", en: "", errcode: 4010152},

	//接收互通卡券相关
	"card_cross_receive-card_null": {cn: "互通卡券不存在", en: "", errcode: 4010150},
	"card_cross_receive-api_errror": {cn: "接收互通卡券微信接口错误", en: "", errcode: 4010151},
	"card_cross_receive-update_status_failure": {cn: "接收互通卡券时，修改互通卡券状态失败", en: "", errcode: 4010153},

	//列表互通卡券相关
	"card_cross_list-page_count_over": {cn: "每页数据条数超过限制", en: "", errcode: 4010001},

};
















