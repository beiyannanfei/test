var a = {
	uid: {type: String, required: true},            //卡券模板所属用户id
	label: {type: String, required: true},          //卡券模板所属标签
	userType: {type: String, required: true},       //卡券模板是私有还是公有
	createTime: {type: Date, default: Date.now},    //创建时间
	isDel: {type: Boolean, default: false},         //是否有效
	card_type: {type: String, required: true},      //卡券类型 取值范围[GROUPON,CASH,DISCOUNT,GIFT,GENERAL_COUPON]
	isOpen: {type: Boolean, required: true},        //是否对外开放(公共卡券创建时不对外,私有卡券创建是对外)
	base_info: {                                    //卡券基础信息字段
		logo_url: {type: String, required: true},     //卡券的商户logo，建议像素为300*300。
		code_type: {type: String, required: true},    //码型 取值[CODE_TYPE_TEXT,CODE_TYPE_BARCODE,CODE_TYPE_QRCODE,CODE_TYPE_ONLY_QRCODE,CODE_TYPE_ONLY_BARCODE,CODE_TYPE_NONE]
		brand_name: {type: String, required: true},   //商户名字,字数上限为12个汉字。
		title: {type: String, required: true},        //卡券名，字数上限为9个汉字。(建议涵盖卡券属性、服务及金额)。
		color: {type: String, required: true},        //券颜色 取值[Color010,Color020,Color030,Color040,Color050,Color060,Color070,Color080,Color081,Color082,Color090,Color100,Color101,Color102]
		notice: {type: String, required: true},       //卡券使用提醒，字数上限为16个汉字。
		description: {type: String, required: true},  //卡券使用说明，字数上限为1024个汉字。
		sku: {                                        //商品信息
			quantity: {type: Number, required: true},   //卡券库存的数量，上限为100000000
		},
		date_info: {                                  //使用日期，有效期的信息。
			type: {type: String, required: true},       //使用时间的类型 取值[DATE_TYPE_FIX_TIME_RANGE, DATE_TYPE_FIX_TERM]
			begin_timestamp: Number,                    //表示起用时间秒数 DATE_TYPE_FIX_TIME_RANGE 必填
			end_timestamp: Number,                      //表示结束时间秒数 DATE_TYPE_FIX_TIME_RANGE 必填  DATE_TYPE_FIX_TERM选填
			fixed_term: Number,                         //表示自领取后多少天内有效，不支持填写0。  DATE_TYPE_FIX_TERM 必填
			fixed_begin_term: Number                    //表示自领取后多少天开始生效，领取后当天生效填写0。（单位为天）DATE_TYPE_FIX_TERM 必填
		},
		//base_info 选填字段
		use_custom_code: Boolean,                     //是否自定义Code码。填写true或false，默认为false。通常自有优惠码系统的开发者选择自定义Code码，并在卡券投放时带入Code码
		get_custom_code_mode: String,                 //表示该卡券为预存code模式卡券，须导入超过库存数目的自定义code后方可投放，填入该字段后，quantity字段须为0,须导入code后再增加库存 use_custom_code为true时该字段才有效
		bind_openid: Boolean,                         //是否指定用户领取，填写true或false。默认为false。通常指定特殊用户群体投放卡券或防止刷券时选择指定用户领取。
		service_phone: String,                        //客服电话
		location_id_list: Array,                      //门店位置poiid。调用POI门店管理接口获取门店位置poiid。具备线下门店的商户为必填
		use_all_locations: Boolean,                   //设置本卡券支持全部门店，与location_id_list互斥
		source: String,                               //第三方来源名，例如同程旅游、大众点评。
		custom_url_name: String,                      //自定义跳转外链的入口名字
		center_title: String,                         //卡券顶部居中的按钮，仅在卡券状态正常(可以核销)时显示
		center_sub_title: String,                     //显示在入口下方的提示语，仅在卡券状态正常(可以核销)时显示。
		center_url: String,                           //顶部居中的url，仅在卡券状态正常(可以核销)时显示。
		custom_url: String,                           //自定义跳转的URL
		custom_url_sub_title: String,                 //显示在入口右侧的提示语。
		promotion_url_name: String,                   //营销场景的自定义入口名称
		promotion_url: String,                        //入口跳转外链的地址链接
		promotion_url_sub_title: String,              //显示在营销入口右侧的提示语
		get_limit: {type: Number, default: 50},       //每人可领券的数量限制,不填写默认为50.
		can_share: Boolean,                           //卡券领取页面是否可分享。
		can_give_friend: Boolean                      //卡券是否可转赠
	},
	special_info: {                                 //特殊字段,不同类型卡券专享
		deal_detail: String,                          //团购券专用，团购详情。GROUPON 必填
		least_cost: Number,                           //代金券专用，表示起用金额（单位为分）,如果无起用门槛则填0。CASH 必填
		reduce_cost: Number,                          //代金券专用，表示减免金额。（单位为分） CASH 必填
		discount: Number,                             //折扣券专用，表示打折额度（百分比）。填30就是七折。DISCOUNT 必填
		gift: String,                                 //兑换券专用，填写兑换内容的名称。GIFT 必填
		default_detail: String                        //优惠券专用，填写优惠详情。GENERAL_COUPON 必填
	},
	advanced_info: {                                //创建优惠券特有的高级字段  全是选填
		use_condition: {                              //使用门槛（条件）字段，若不填写使用条件则在券面拼写：无最低消费限制，全场通用，不限品类；并在使用说明显示：可与其他优惠共享
			accept_category: String,                    //指定可用的商品类目 仅用于代金券类型 CASH
			reject_category: String,                    //指定不可用的商品类目 仅用于代金券类型 CASH
			least_cost: Number,                         //满减门槛字段 可用于兑换券和代金券 GIFT CASH
			object_use_for: String,                     //购买xx可用类型门槛 仅用于兑换 GIFT
		                                              //不可以与其他类型共享门槛，填写false时系统将在使用须知里拼写“不可与其他优惠共享”，填写true时系统将在使用须知里拼写“可与其他优惠共享”，默认为true
			can_use_with_other_discount: {type: Boolean, default: true}
		},
		abstract: {                                   //封面摘要结构体名称
			abstract: String,                           //封面摘要简介
			icon_url_list: [String]
		},
		text_image_list: [mongoose.Schema.Types.Mixed],    //图文列表，显示在详情内页，优惠券券开发者须至少传入一组图文列表
		// {image_url: "图片链接",	text: "图文描述"}
		business_service: [String],   //商家服务类型可多选 取值: BIZ_SERVICE_DELIVER-外卖服务,BIZ_SERVICE_FREE_PARK-停车位,BIZ_SERVICE_WITH_PET-可带宠物,BIZ_SERVICE_FREE_WIFI-免费wifi
		time_limit: [mongoose.Schema.Types.Mixed] //使用时段限制
		/*{ //支持多个结构
		 type: "限制类型枚举值",  //[MONDAY TUESDAY WEDNESDAY THURSDAY FRIDAY SATURDAY SUNDAY]
		 begin_hour: "当前type类型下的起始时间（小时），如当前结构体内填写了MONDAY，此处填写了10，则此处表示周一 10:00可用",
		 begin_minute: "当前type类型下的起始时间（分钟），如当前结构体内填写了MONDAY，begin_hour填写10，此处填写了59，则此处表示周一 10:59可用",
		 end_hour: "当前type类型下的结束时间（小时），如当前结构体内填写了MONDAY，此处填写了20，则此处表示周一 10:00-20:00可用",
		 end_minute: "当前type类型下的结束时间（分钟），如当前结构体内填写了MONDAY，begin_hour填写10，此处填写了59，则此处表示周一 10:59-00:59可用"
		 }*/
	}
};
