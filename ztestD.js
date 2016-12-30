var cardDataCheck = function (data) {
	var errs = [];

	// 首先检查4个主要字段, special_info 是自定义字段，为了容易理解。在同步到微信时会做处理
	if (!data.card_type) errs.push('card_type');
	if (!data.base_info) errs.push('base_info');

	//会员卡
	if (data.card_type.toUpperCase() === 'MEMBER_CARD') {
		if (!data.member_info) errs.push('member_info');
	} else { //普通卡卷
		if (!data.special_info) errs.push('special_info');
	}

	if (!data.base_info.color) errs.push('color');

	if (errs.length) return errs;

	// 检查 base_info 的必须字段
	_.each(fields, function (f) {
		var arr = f.split('.');
		if (arr.length === 1) {
			if (!data.base_info[f]) errs.push(f);
		} else {
			var first = arr[0];
			var second = arr[1];
			if (data.base_info.use_custom_code && f === 'sku.quantity') {
				if (data.sku && data.sku.quantity) {
					errs.push(f);
				}
				return;
			}
			if (!data.base_info[first]) {
				errs.push(first);
			} else if (!data.base_info[first][second]) {
				errs.push(f);
			}
		}
	});

	// 检查card_type 对应的非 base_info 字段（本系统定义为 special_info）
	switch (data.card_type) {
		//团购
		case 'GROUPON':
			if (!data.special_info.deal_detail) errs.push('deal_detail');
			break;
		//代金
		case 'CASH':
			if (!data.special_info.reduce_cost) errs.push('reduce_cost');
			break;
		//折扣
		case 'DISCOUNT':
			if (!data.special_info.discount) errs.push('discount');
			break;
		//兑换
		case 'GIFT':
			if (!data.special_info.gift) errs.push('gift');
			break;
		//优惠
		case 'GENERAL_COUPON':
			if (!data.special_info.default_detail) errs.push('default_detail');
			break;
		//会员卡
		case 'MEMBER_CARD':
			if (data.member_info.activate_url === undefined) errs.push('activate_url');
			if (data.member_info.supply_balance === undefined) errs.push('supply_balance');
			if (data.member_info.prerogative === undefined) errs.push('prerogative');
			break;
		default:
	}

	if (data.advanced_info) {
		//高级参数部分验证--use_condition
		if (data.advanced_info.use_condition) {
			if (data.card_type !== 'CASH') {
				if (data.advanced_info.use_condition.accept_category) {
					delete data.advanced_info.use_condition.accept_category;
				}
				if (data.advanced_info.use_condition.reject_category) {
					delete data.advanced_info.use_condition.accept_category;
				}
			}

			if (data.card_type !== 'GIFT') {
				delete data.advanced_info.use_condition.object_use_for;
			}

			if (data.advanced_info.use_condition.can_use_with_other_discount !== undefined) {
				data.advanced_info.use_condition.can_use_with_other_discount = Boolean(data.advanced_info.use_condition.can_use_with_other_discount);
			}

		}
		//高级参数部分验证--abstract
		if (!data.advanced_info.abstract) {
			errs.push('abstract');
		} else {
			if (!data.advanced_info.abstract.icon_url_list) {
				errs.push('icon_url_list');
			}
		}
		//高级参数部分验证--text_image_list
		if (!data.advanced_info.text_image_list) {
			errs.push('text_image_list');
		}
	}
	return errs;
};