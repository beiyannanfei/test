var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var Joi = require('joi');
var config = require('config');
var logger = require('../utils/log')('lotteryCtrl');
var logCtrl = require('./log');

var n = 0;

/**
 * 根据 ID 获取抽奖规则信息
 * @param  {String}            lotteryId  抽奖规则信息 ID
 * @return {Promise}
 */
var getLotteryById = function(lotteryId, uid, appid) {
	/* istanbul ignore if */
	if (!lotteryId) {
		return Promise.resolve(null);
	}
	var query = {
		_id: lotteryId,
		isDeleted: false
	};
	if (uid) {
		query.uid = uid;
	}
	if (appid) {
		query.appid = appid;
	}
	return Lottery.findOne(query);
};

/**
 * 获取抽奖日志列表
 *
 * @param {Object}  query  过滤规则
 * @param {Number}  page   分页参数
 * @param {Number}  count  分页参数
 *
 * @return {Promise}
 */
var getLogs = function(query, page, count, sortBy) {
	page = Math.abs(page) || 1;
	count = Math.abs(count) || 20;
	if (!sortBy) {
		sortBy = {drawTime: -1};
	}
	return LotteryLog.find(query)
		.limit(count)
		.skip(count * (page - 1))
		.sort(sortBy);
};

/**
 * 抽奖次数修改
 * @param  {String}  lotteryId 抽奖规则 ID
 * @param  {Number}  count     抽奖规则的人次最大限制
 * @param  {Number}  num       次数加一(发奖) 或 减一(回滚) ( 1 or -1 )
 * @param  {Object}  prize     奖品信息
 * @return {Promise}
 */
var lotteryCountInc = function(lotteryId, count, prize, type, fOpenId, rollback) {
	var query = {
		_id: lotteryId,
		isDeleted: false
	};

	// 总抽奖次数修改数值，卡券发放数值
	var chanceNum, cardNum;
	// 若是发放卡券，则需要加上抽奖规则次数上限条件
	/* istanbul ignore else */
	if (!rollback) {
		query['rules.use'] = {
			$lt: count
		};
		chanceNum = 1;
		cardNum = 1;
	} else {
		chanceNum = -1;
		cardNum = -1;
	}

	if (type === 'multi') {
		cardNum = cardNum * ((fOpenId && fOpenId.length || 0) + 1);
	}

	var updated = {
		$inc: {
			'rules.use': chanceNum
		}
	};

	// 中奖，需要发放卡券 或 回滚
	if (prize && prize.cardId) {
		// 若是发放卡券，则需要以不大于卡券库存作为条件
		if (!rollback) {
			query['cardSentInfo.' + prize.id] = {
				$lte: prize.quantity - cardNum
			};
		}
		updated['$inc']['cardSentInfo.' + prize.id] = cardNum;
	}
	return Lottery.update(query, updated).then(function (ret) {
		/* istanbul ignore if */
		if (!ret || !ret.n) {
			return Promise.reject({
				errcode: 4240006,
				errmsg: 'Draw error',
				info: _.pick(prize, 'remainDailyChanceCount', 'drawTime')
			});
		}

		return prize;
	});
};

/**
 * 写抽奖记录 log 日志
 * @param  {Object} data [description]
 * @return {Promise}
 */
var writeLotteryLog = function(data, prize, type, fOpenId) {
	var time = Date.now();
	data.drawTime = time;
	var _friendDrawLog;
	if (type === 'multi') {
		data.friends = fOpenId;
		_friendDrawLog = _.map(fOpenId, function(id) {
			return {
				lotteries: data.lotteries,
				type: 'follow',
				multi: true,
				friends: _.union(_.without(fOpenId, id), [data.openId]),
				dOpenId: data.openId,
				openId: id,
				status: data.status,
				cardInfo: data.cardInfo,
				drawTime: time
			};
		});
	}
	var docs = [data];
	if (_friendDrawLog) {
		docs = docs.concat(_friendDrawLog);
	}
	return LotteryLog.create(docs).then(function(logs) {
		var lidMap = {}, log;
		_.each(logs, function(item) {
			lidMap[item.openId] = item._id;
			if (item.type === 'draw') {
				log = item.toJSON();
			}
		});
		log.lidMap = lidMap;
		return log;
	}).catch(function(err) {
		// 出错回滚
		lotteryCountInc(data.lotteries, null, prize, type, fOpenId, true);
		return Promise.reject(err);
	});
};

/**
 * 抽奖此次检查
 *   1. 是否达到个人总共参数次数上线
 *   2. 是否达到当天抽奖次数上线
 *   3. 是否达到中间次数上线
 * @param  {String}  lotteryId 抽奖规则 ID
 * @param  {String}  openid    抽奖用户 openid
 * @param  {Object}  rules     抽奖规则
 * @retrun {Promise}           [已抽奖次数，已中奖次数，今日抽奖次数]
 */
var drawCountCheck = function(lotteryId, openid, rules) {
	var query = {
		lotteries: lotteryId,
		openId: openid,
		type: 'draw'
	};
	return getLogs(query, 1, 1).then(function(logs) {
		var log = logs && logs[0] && logs[0].toJSON() || {};
		// 个人总共抽奖次数达到上限
		if ((log.totalCount || 0) >= rules.personChanceCount) {
			throw {
				errcode: 4240007,
				errmsg: 'PersonChanceCount reach limit',
				info: {openId: openid}
			};
		}

		var _dailyCount = 0;
		var _totalCount = log.totalCount || 0;
		var _winCount = log.winCount || 0;
		var time = moment().startOf('day').valueOf();
		if (log.drawTime && log.drawTime > time) {
			_dailyCount = log.dailyCount;
		}

		// 个人今日剩余抽奖次数达到上限
		if (_dailyCount >= rules.personDailyChanceCount) {
			throw {
				errcode: 4240008,
				errmsg: 'PersonDailyChanceCount reach limit',
				info: {openId: openid}
			};
		}

		var result = [_totalCount, _winCount, _dailyCount];

		return result;
	});
};

/**
 * 往 base-service 写 log 日志
 * @param  {Object} logData 活动访问日志信息
 * @param  {String} action  用户进行的动作
 * @return {Promise}
 */
var writeLog = function(logData, action, cardId) {
	var _data = _.cloneDeep(logData);
	_data.action = action;
	_data.cardId = cardId;
	baseTool.writeLog(_data);
};

/**
 * 抽奖
 * @param  {Number}   drawCount 已抽奖次数
 * @param  {Number}   winCount  已中奖次数
 * @return {Promise}            若中奖则返回奖品信息，否则返回空
 */
var luck = function (lottery, drawCount, winCount, todayDrawCount) {
	var result = {};

	// 个人中奖次数超过限制
	if (lottery.rules.personMustGetPrizeMaxCount && winCount >= lottery.rules.personMustGetPrizeMaxCount) {
		return result;
	}

	var cardSentInfo = lottery.cardSentInfo;
	/* istanbul ignore if */
	if (!cardSentInfo) {
		return result;
	}

	// 规则剩余的抽奖总次数
	var randomMax = (lottery.rules.count || 0) - lottery.rules.use;
	// 个人剩余的抽奖次数
	var remainChangeCount = (lottery.rules.personChanceCount || 0) - drawCount;
	// 个人剩余的必中次数
	var remainMustCount = (lottery.rules.personMustGetPrizeMinCount || 0) - winCount;

	// 若用户的剩余必中次数不大于抽奖次数，则进入必中逻辑
	/* istanbul ignore else */
	if (remainChangeCount > 0 && remainChangeCount <= remainMustCount) {
		randomMax = 0;
		lottery.cardInfoList.forEach(function(cardInfo) {
			var _opportunity = cardInfo.quantity - cardSentInfo[cardInfo.id];
			/* istanbul ignore else */
			if (_opportunity > 0) {
				randomMax += _opportunity;
			}
		});
	}

	var random = _.random(0, randomMax);
	for (var i = lottery.cardInfoList.length - 1; i >= 0; i--) {
		var prize = lottery.cardInfoList[i];
		// 卡券信息不完整（无意义，基本不存在此情况）
		/* istanbul ignore if */
		if (!prize || !prize.quantity || !prize.id || !prize.cardId) {
			continue;
		}
		var probability = prize.quantity - (cardSentInfo[prize.id] || 0);
		// 卡券库存量为 0，不发放次卡券
		if (probability <= 0) {
			continue;
		} else if (random <= probability) {// 找到中奖卡券
			result.id = prize.id;
			result.cardId = prize.cardId;
			result.quantity = prize.quantity;
			if (prize.appid) {
				result.appid = prize.appid;
			}
			break;
		} else { // 中的不是此卡券，继续
			random = random - probability;
		}
	}

	return result;
};

/**
 * 根据中奖信息选取中奖位置
 */
var choosePosition = function(prize, position) {
	if (!position || !position.length) {
		return null;
	}
	if (prize && prize.cardId) {
		position = _.filter(position, function(item) {
			return item.cardId === prize.cardId;
		});
	} else {
		position = _.filter(position, function(item) {
			return !item.cardId;
		});
	}

	var len = position && position.length;
	if (!len) {
		return null;
	}
	var random = Math.round(Math.random() * (len - 1));
	if (random >= len) random = len -1;
	return position[random].index;
};

/**
 * 保证数字不小于 0
 */
var ensureGtZero = function(num) {
	num = +num;
	if (!num || num < 0) {
		num = 0;
	}
	return num;
};

/**
 * 计算count
 */
var getCount = function(query) {
	query.isDeleted = false;
	return Lottery.count(query);
};

/**
 * 抽奖规则数据合法性校验
 */
var _dataRulesCheck = function(data) {
	// 个人参与次数不能大于活动总次数
	if (data.rules.personChanceCount > data.rules.count) {
		return {
			errcode: 4240260,
			errmsg: 'PersonChanceCount can not more than count'
		}
	}

	// 个人每天参与次数不能大于个人总参与次数
	if (data.rules.personDailyChanceCount > data.rules.personChanceCount) {
		return  {
			errcode: 4240261,
			errmsg: 'PersonDailyChanceCount can not more than personChanceCount'
		}
	}

	// 个人最大中奖次数不能大于个人总参与次数
	if (data.rules.personMustGetPrizeMaxCount > data.rules.personChanceCount) {
		return {
			errcode: 4240262,
			errmsg: 'PersonMustGetPrizeMaxCount can not more than personChanceCount'
		}
	}

	// 个人最小中奖次数不能大于个人总参与次数
	if (data.rules.personMustGetPrizeMinCount > data.rules.personChanceCount) {
		return {
			errcode: 4240263,
			errmsg: 'PersonMustGetPrizeMinCount can not more than personChanceCount'
		}
	}

	// 若个人最大中奖次数有效
	// 个人最小中奖次数不能大于个人最大中奖次数
	if (data.rules.personMustGetPrizeMaxCount && data.rules.personMustGetPrizeMinCount > data.rules.personMustGetPrizeMaxCount) {
		return {
			errcode: 4240264,
			errmsg: 'PersonMustGetPrizeMinCount can not more than personMustGetPrizeMaxCount'
		}
	}

	return null;
};

/**
 * 修改抽奖规则前的数据校验
 * 检测抽奖规则数据是否合法
 * @param  {String} lotteryId 抽奖规则 ID
 * @param  {Object} lottery   原始抽奖规则信息
 * @param  {Object} data      新的抽奖信息
 * @return {Promise}          返回一个 object，修改以后的抽奖规则信息
 */
var _updateFileds = ['count', 'personChanceCount', 'personDailyChanceCount', 'personMustGetPrizeMinCount', 'personMustGetPrizeMaxCount'];
var _updateDataCheck = function(uid, appid, lotteryId, data) {
	return getLotteryById(lotteryId, uid, appid).then(function(lottery) {
		if (!lottery) {
			return Promise.reject({
				errcode: 4240151,
				errmsg: 'Lottery not found'
			});
		}

		lottery = lottery.toJSON();

		// 规则修改信息检测
		var updatedObj = {'$set': {}, '$unset': {}};
		/* istanbul ignore else */
		if (!_.isEmpty(data.rules)) {
			_.each(_updateFileds, function(f) {
				var _target_num = +data.rules[f] || 0;
				var _use = lottery.rules.use || 0;
				/* istanbul ignore else */
				if (!data.rules.hasOwnProperty(f)) {
					throw {
						errcode: 4010093,
						errmsg: 'Params invalid',
						info: f + ' is missing'
					};
				}
				/* istanbul ignore else */
				if (_target_num < 0) {
					throw {
						errcode: 4240251,
						errmsg: 'Can not less than 0',
						info: f
					};
				}
				/* istanbul ignore else */
				if (f === 'count' && _target_num < _use) {
					throw {
						errcode: 4240252,
						errmsg: 'Count can not less than use',
						info: _use
					};
				}
				updatedObj['$set']['rules.' + f] = _target_num;
			});
		}

		// 卡券信息检测
		var cardObj = {};
		var updateCardList = [], index = 0;
		_.each(lottery.cardInfoList, function(item) {
			cardObj[item.cardId] = {
				id: item.id,
				sent: lottery.cardSentInfo[item.id],
				quantity: item.quantity
			};
			/* istanbul ignore else */
			if (item.id > index) {
				index = item.id;
			}
		});
		index++;

		if (data.hasOwnProperty('cardInfoList')) {
			var _cardInfoList = data.cardInfoList || [];
			for(var i=0,len = _cardInfoList.length; i < len; i++) {
				var item = _cardInfoList[i] || {};
				var _cardId = item.cardId;
				// 卡券 ID 不存在，或未传 quantity 参数
				if (!_cardId || !item.hasOwnProperty('quantity')) {
					throw {
						errcode: 4010093,
						errmsg: 'Params invalid',
						info: 'cardId or quantity is missing'
					};
				}

				if (item.quantity < 0) {
					throw {
						errcode: 4240251,
						errmsg: 'Can not less than 0',
						info: _cardId
					};
				}

				// 卡券的投放量修改不能小于发放量
				if (cardObj[_cardId] && cardObj[_cardId].sent > item.quantity) {
					throw {
						errcode: 4240253,
						errmsg: 'Card quantity can not less than sent',
						info: _cardId
					};
				}

				var _obj = {
					id: index,
					cardId: _cardId,
					quantity: item.quantity
				};
				/* istanbul ignore if */
				if (item.appid) {
					_obj.appid = item.appid;
				}

				if (cardObj[_cardId]) { // 修改已存在的卡券
					_obj.id = cardObj[_cardId].id;
					cardObj[_cardId].holdon = true;
				} else { // 新添加的卡券
					_obj.id = index;
					index++;
					updatedObj['$set']['cardSentInfo.' + _obj.id] = 0;
				}
				updateCardList.push(_obj);
			}

			// 检测需要删除的卡券是否能删除
			_.each(cardObj, function(item, cardId) {
				if (!item.holdon) {
					if (item.sent) {
						throw {
							errcode: 4240255,
							errmsg: 'Can not remove more than 0 sent',
							info: cardId
						};
					} else {
						updatedObj['$unset']['cardSentInfo.' + item.id] = 1;
					}
				}
			});

			if (updateCardList.length > 20) {
				throw {
					errcode: 4240257,
					errmsg: 'CardInfoList length is more than 20'
				};
			}
		}

		if (updateCardList.length) {
			updatedObj.cardInfoList = updateCardList;
		}
		if (_.isEmpty(updatedObj['$set'])) {
			delete updatedObj['$set'];
		}
		if (_.isEmpty(updatedObj['$unset'])) {
			delete updatedObj['$unset'];
		}

		return updatedObj;
	});
};

/**
 * 修改抽奖规则
 */
var _update = function(query, updateObj) {
	query.isDeleted = false;
	return Lottery.update(query, updateObj).then(function(ret) {
		return ret && ret.n;
	});
};

/**
 * 卡券签名
 */
var cardSign = function(appid, data) {
	return new Promise(function(resolve, reject) {
		baseTool.cardSign(appid, data, function(err, ret) {
			if (err) {
				reject(err);
			} else {
				resolve(ret);
			}
		});
	});
};

exports.getLotteryById = getLotteryById;

/**
 * 微信用户抽奖
 * @param {String}   appid      公众号 appid
 * @param {String}   lotteryId  抽奖规则信息 ID
 * @param {String}   cOpenId    cookie 中的 openid，当前抽奖用户的 openid
 * @param {String}   openIds    本次多屏互动抽奖所有用户 openid
 * @return {Promise}            抽奖记录信息，详细请查看 lotteryLog Model
 */
exports.run = function(appid, lotteryId, type, openidObj, logData, position) {
	var lottery, _drawLog, _friendDrawLog, resultLog;
	var dOpenId;
	if (type === 'multi') {
		dOpenId = openidObj.dOpenId;
	} else {
		dOpenId = openidObj.mOpenId;
	}

	return getLotteryById(lotteryId).then(function(ret) {
		// 对应的抽奖规则不存在
		if (!ret) {
			throw {
				errcode: 4240151,
				errmsg: 'Lottery not found'
			};
		}

		lottery = ret.toJSON();
		// 抽奖总人次达到上限
		if (lottery.rules.count <= lottery.rules.use) {
			throw {
				errcode: 4240005,
				errmsg: 'Lottery have reach person limit'
			};
		}

		// 检测用户是否还有抽奖机会
		// 若没有则抛出错误
		// 若有则用户返回 [总抽奖次数，中奖次数，今日抽奖次数]
		return drawCountCheck(lotteryId, dOpenId, lottery.rules);
	}).then(function(result) {
		writeLog(logData, 'try');
		_drawLog = {
			lotteries: lotteryId,
			type: 'draw',
			openId: dOpenId,
			totalCount: result[0] + 1,
			winCount: result[1],
			dailyCount: result[2] + 1,
			status: 0
		};

		// 抽奖
		var prize = luck(lottery, result[0], result[1], result[2]);

		// 有 cardId 表示中奖
		if (prize && prize.cardId) {
			_drawLog.status = 1;
			_drawLog.cardInfo = {
				cardId: prize.cardId,
				appid: prize.appid
			};
			// 中奖数次加 1
			_drawLog.winCount += 1;
		}

		if (type === 'multi') {
			_drawLog.multi = true;
		} else {
			_drawLog.multi = false;
		}

		// 修改抽奖规则的总抽奖次数。若中奖还需修改卡券的发放量
		return lotteryCountInc(lotteryId, lottery.rules.count, prize, type, openidObj.fOpenId);
	}).then(function(prize) {
		// 中奖后写中奖 log
		if (prize.cardId) {
			writeLog(logData, 'adward', prize.cardId);
		}

		// 记录抽奖 log 日志
		return writeLotteryLog(_drawLog, prize, type, openidObj.fOpenId);
	}).then(function(log) {
		// 返回数据需要返回当日还剩余的抽奖次数
		log.remainDailyChanceCount = lottery.rules.personDailyChanceCount - log.dailyCount;
		log.remainChanceCount = lottery.rules.personChanceCount - log.totalCount;
		log.eventRemainCount = lottery.rules.count - lottery.rules.use - 1;
		// 现阶段不考虑多屏应用抽奖情况
		// 多屏奖位 TODO
		if (type !== 'multi') {
			var index = choosePosition(log.cardInfo, position);
			if (index !== null) {
				log.positionIndex = index;
			}
		}
		// 获取卡券信息
		return logCtrl.get(appid, log);
	});
};

/**
 * 领取奖品
 * @param  {String} lid        活动记录 ID
 * @param  {String} lotteryId  抽奖规则 ID (选传)
 *
 * @return {Promise}
 */
exports.token = function(lid, lotteryId, retry) {
	var query = {
		_id: lid,
		status: 1
	};
	/* istanbul ignore else */
	if (lotteryId) {
		query.lotteries = lotteryId;
	}

	return LotteryLog.update(query, {
		$set: {
			status: 2,
			tokenTime: _.now()
		}
	}).catch(function(err) {
		if (!retry) {
			return exports.token(lid, lotteryId, true);
		} else {
			return Promise.reject({
				errcode: 4240009,
				errmsg: 'Add card notice failure',
				info: lid
			});
		}
	});
};

/**
 * 卡券签名
 * @param {String}   appid      公众号 appid
 * @param {String}   lotteryId  抽奖规则信息 ID
 * @param {String}   lid        抽奖记录 ID
 * @param {String}   opendId    用户 openid
 */
exports.sign = function(appid, appName, eid, lotteryId, lid, openId) {
	var query = {
		_id: lid,
		lotteries: lotteryId,
		openId: openId
	};
	return getLogs(query, 1, 1).then(function(logs) {
		var log = logs && logs[0];
		if (!log) {
			throw {
				errcode: 4240302,
				errmsg: 'Lottery log not exist'
			};
		}

		if (log.status === 0 || !log.cardInfo || !log.cardInfo.cardId) {
			throw {
				errcode: 4240303,
				errmsg: 'Not win'
			};
		}

		if (log.status === 2) {
			throw {
				errcode: 4240304,
				errmsg: 'Have token'
			};
		}

		var data = {
			card_id: log.cardInfo.cardId,
			event: appName,
			eventId: eid
		};
		return cardSign(appid, data);
	});
};


exports.geLotteryLogs = function(appid, lotteryId, openId, options) {
	options = options || {};
	var page = +options.page || 1;
	var count = +options.count || 20;
	if (count > (config.perPageMaxCount || 100)) {
		return Promise.reject({
			errcode: 4010001,
			errmsg: 'Per page count over the limit',
			info: {maxCount: config.perPageMaxCount || 100}
		});
	}

	var query = {
		lotteries: lotteryId
	};

	// all 表示是否查询整个平台此活动的抽奖记录
	// 只允许查询最经 20 条
	if (!options.all) {
		query.openId = openId;
	} else {
		page = 1;
		count = 20;
	}

	// 抽检记录类型，draw or follow
	if (options.type) {
		query.type = options.type;
	}

	// 抽奖记录状态，未中奖（0），已中奖（1），已领取（2）
	var status = options.status;
	if (status) {
		if (_.isString(status)) {
			status = status.split(',');
		}
		status = _.uniq(_.map(status, Number));
		query.status = {
			$in: status
		};
	}

	return getLogs(query, page, count).then(function(logs) {
		return logCtrl.list(appid, logs);
	});
};

/**
 * 获取页面显示时的 log 日志
 * @return {[type]} [description]
 */
exports.getViewLogs = function(lotteryId, openId, options) {
	var result = {
		remainDailyChanceCount: 0,
		remainChanceCount: 0,
		eventRemainCount: 0
	};
	/* istanbul ignore if */
	if (!lotteryId || !openId) {
		return Promise.resolve(result);
	}
	options = options || {};
	var execArr = [
		// 获取抽奖规则信息
		getLotteryById(lotteryId),
		// 获取自己最后一次抽奖记录信息
		getLogs({lotteries: lotteryId, openId: openId,  type: 'draw'}, 1, 1)
	];


	var nowTime = moment().startOf('day').valueOf();
	return Promise.all(execArr).then(function(arr) {
		var lottery = arr[0];
		var lastLog = arr[1] && arr[1][0] || {};
		if (_.isFunction(lastLog.toJSON)) {
			lastLog = lastLog.toJSON();
		}
		/* istanbul ignore else */
		if (lottery && lottery.rules) {
			result.eventRemainCount = ensureGtZero(lottery.rules.count - lottery.rules.use);
			result.remainChanceCount = ensureGtZero(lottery.rules.personChanceCount - (lastLog.totalCount || 0));
			if (lastLog.drawTime > nowTime) {
				result.remainDailyChanceCount = ensureGtZero(lottery.rules.personDailyChanceCount - (lastLog.dailyCount || 0));
			} else {
				result.remainDailyChanceCount = ensureGtZero(lottery.rules.personDailyChanceCount);
			}
		}
		return result;
	});
};

// 抽奖规则数据校验规则
var schema = Joi.object().keys({
	rules: Joi.object().keys({
		count: Joi.number().min(0).max(10000000).required(),
		personChanceCount: Joi.number().min(0).required(),
		personDailyChanceCount: Joi.number().min(0).required(),
		personMustGetPrizeMinCount: Joi.number().min(0),
		personMustGetPrizeMaxCount: Joi.number().min(0)
	}),
	cardInfoList: Joi.array().min(1).max(20).items(Joi.object().keys({
		cardId: Joi.string().required(),
		appid: Joi.string().empty(''),
		quantity: Joi.number().min(0).required()
	}))
});
exports.lotterySchema = schema;
exports.dataCheck = function(req, res, next) {
	Joi.validate(req.body, schema, function (err, value) {
		if (err) {
			err = {
				status: 400,
				errcode: 4010093,
				errmsg: 'Params invalid',
				info: err.details
			};
			next(err);
		} else {
			next();
		}
	});
};

/**
 * 新建抽奖规则
 */
exports.create = function(data) {
	var err = _dataRulesCheck(data);
	if (err) {
		return Promise.reject(err);
	}
	// 给卡券信息赋值 ID，并初始化卡券发放信息
	data.cardSentInfo = {};
	_.each(data.cardInfoList, function(item, index) {
		item.id = (index + 1);
		data.cardSentInfo[item.id] = 0;
	});
	logger.info('uid %s appid %s create lottery data %s', data.uid, data.appid, data);
	return Lottery.create(data).then(function(ret) {
		logger.info('uid %s appid %s create lottery success and lotteryId %s', data.uid, data.appid, ret.id);
		return ret.toJSON();
	});
};

/**
 * 修改抽奖规则
 * @param  {String} uid       账户 Id
 * @param  {String} appid     公众号 appid
 * @param  {String} lotteryId 抽奖规则 ID
 * @param  {Object} data      需要修改的数据字段
 *   {
 *     rules: {
 *       count: 100, # 总抽奖次数
 *       personChanceCount: 10, # 每人总抽奖次数
 *       personDailyChanceCount: 3, # 每人每天总抽奖次数
 *       personMustGetPrizeMinCount: 1, # 每人最小中奖次数
 *       personMustGetPrizeMaxCount: 3 # 每人最大中奖次数
 *     },
 *     cardInfoList: [
 *       {
 *         cardId: '',
 *         appid: '',
 *         quantity: 100
 *       }
 *     ]
 *   }
 * 一次只能修改一个值 或 删除一个奖品
 */
exports.update = function(uid, appid, lotteryId, data) {
	if (data.rules) {
		var err = _dataRulesCheck(data);
		if (err) {
			return Promise.reject(err);
		}
	}
	return _updateDataCheck(uid, appid, lotteryId, data).then(function(data) {
		logger.info('uid %s appid %s update lottery %s data %s', uid, appid, lotteryId, data);
		return _update({
			_id: lotteryId,
			uid: uid,
			appid: appid
		}, data);
	});
};

/**
 * 列表抽奖规则
 * @param  {Object} query 过滤条件
 * @param  {Number} page  分页参数，第几页
 * @param  {Number} count 分页参数，每页多少条
 * @return {Promise}
 */
exports.list = function(query, page, count) {
	page = Math.abs(page) || 1;
	count = Math.abs(count) || 20;
	if(count > (config.perPageMaxCount || 100)) {
		return Promise.reject({
			errcode: 4010001,
			errmsg: 'Per page count over the limit',
			info: {maxCount: config.perPageMaxCount || 100}
		});
	}
	query.isDeleted = false;
	var data;

	return Lottery.find(query)
		.skip(count * (page - 1))
		.limit(count)
		.sort({createdTime: -1})
		.then(function(list) {
			data = _.map(list, function(item) {
				item = item.toJSON();
				_.each(item.cardInfoList, function(info) {
					info.sent = item.cardSentInfo[info.id];
				});
				delete item.cardSentInfo;
				return item;
			});
			return getCount(query);
		}).then(function(len) {
			return {data: data, count: len};
		});
};

/**
 * 删除抽奖规则
 * @param  {String} uid       账户 Id
 * @param  {String} appid     公众号 appid
 * @param  {String} lotteryId 抽奖规则 ID
 */
exports.remove = function(uid, appid, lotteryId) {
	return getLotteryById(lotteryId, uid, appid).then(function(lottery) {
		if (!lottery) {
			return Promise.reject({
				errcode: 4240151,
				errmsg: 'Lottery not found'
			});
		}

		return _update({_id: lotteryId}, {$set: {isDeleted: true}});
	});
};