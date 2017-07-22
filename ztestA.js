/**
 * @api {get} /alarms 6.1获取报警历史记录
 * @apiGroup 6.Alarms
 * @apiName  deviceList
 *
 * @apiDescription 获取报警历史记录
 *
 * admin 角色用户可查看所有报警记录, operator 只能查看自己所属 appId 下的设备
 *
 * @apiVersion 1.0.0
 *
 * @apiParam {String} [sn 查询一个 SN
 * @apiParam {String=jinggai, water, gps, temperature, humidity, drop, co, co2, so2, no2, ch4, pm2_5, pm10} [sensorTypes 传感器类型，不传为所有类型传感器, 多个传感器以逗号隔开
 * @apiParam {String} [phone 接收短信的手机号码
 * @apiParam {Number} [startTime 历史记录开始时间戳
 * @apiParam {Number} [endTime 历史记录截止时间戳
 * @apiParam {String} [order 数据排序方式: desc 倒序, aec, 升序, 默认 desc
 * @apiParam {String} [sort 按照某一个字段自动排序, 默认 updatedTime 字段
 * @apiParam {String} [offset 数据文档偏移量
 * @apiParam {String} [limit 数据文档条数，默认 20 条
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "errcode": 0,
 *       "data": [{
 *         _id: '5881a866302fa485d3bbd665',
 *         deviceSN: '10300117C5A30F35',
 *         deviceName: 'pm2.5传感器',
 *         appId: 'appId123456',
 *         users: {
 *           _id: '507f1f77bcf86cd799100002',
 *           nickname: '经销商1的商户',
 *           id: '507f1f77bcf86cd799100002'
 *         },
 *         phone: '138112345678',
 *         sensorTypes: 'pm2_5',
 *         sensorData: {
 *           battery: 93,
 *           pm2_5: 100,
 *           pm10: 12,
 *           customer: '3d6f12833a456f12833a4863503c'
 *         },
 *         updatedTime: 1484892262445,
 *         alarmStatus: 2,
 *         reciveStatus: 1,
 *         _updatedTime: '2017-01-20 14:04:22',
 *         alarms_display: '{"title":"pm2.5传感器传感器 10300117C5A30F35","content":"您的PM2.5传感器 10300117C5A30F35 于 2017-01-20 14:04:22 达到 100, 达到预警值。"}'
 *      },{
 *        _id: '5881a866302fa485d3bbd666',
 *        deviceSN: '10800117C6E0A396',
 *        appId: 'appId123456',
 *        users: {
 *           _id: '507f1f77bcf86cd799100001',
 *           nickname: 'dealsname',
 *           id: '507f1f77bcf86cd799100001'
 *        },
 *        phone: '13888881111',
 *        sensorTypes: 'humidity',
 *        sensorData: {humidity: 23.89, temperature: 24.99, battery: 76},
 *        updatedTime: 1482209198942,
 *        alarmStatus: 2,
 *        _updatedTime: '2016-12-20 12:46:38',
 *        alarms_display: '{"title":"设备号: 10800117C6E0A396","content":"您的湿度传感器 10800117C6E0A396 于 2016-12-20 12:46:38 达到 23.89, 达到预警值。"}'
 *      }, {}.....]
 *     }
 *
 * @apiUse NoPermission
 * @apiUse SystemError
 */

// @apiDefine NoPermission

var a = {
	sn: {type: String, unique: true},
	appId: {type: String},
	owners: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // 被分配到的账号
	name: {type: String},
	calibration: Number,
	sensorTypes: {type: Array, default: []}, //设备包含的传感器类型
	deviceType: {type: String, enum: DEVICE_TYPES, default: 'module'},
	sensorData: {
		battery: Number,
		interval: Number, //传输周期, 单位S, 自定义数据中会有此字段
		temperature: Number, // 温度
		humidity: Number, // 湿度
		water: Number, //水位传感器
		jinggai: Boolean, //井盖传感器 ,false 打开, true 闭合
		drop: {type: Number, enum: [0, 1]}, //滴漏传感器
		co: Number, //一氧化碳传感器
		co2: Number, // 二氧化碳传感器
		so2: Number, // 二氧化硫传感器
		no2: Number, //二氧化氮传感器
		ch4: Number, // 甲烷传感器
		pm2_5: Number,//pm2.5
		pm10: Number, //pm10
		leak: Number, // 跑冒滴漏标准数据
		lpg: Number, // 液化石油气标准数据
		distance: Number,  // 水位（测距）传感器数据
		calibration: Number, // 水位（测距）传感器的标定值
		light: Number, // 光线传感器数据
		cover: Boolean, // 标准井盖传感器，表示是否闭合
		level: Boolean, // 标准井盖传感器，表示液位是否到达预警值,
		angle: Number,  // 倾角传感器
		pitch: Number, // 倾角传感器 - 俯仰角
		yaw: Number, // 倾角传感器 - 偏航角
		roll: Number, // 倾角传感器 - 横滚角
		collision: Boolean, // 撞击
		smoke: Boolean,
		customer: String //自定义数据
	},
	tags: {type: Array},
	indexTags: [String],
	lonlat: {type: [Number], index: '2d', default: [0, 0]},
	interval: Number, //传输周期, 单位S
	alarms: { //绑定的报警规则, 报警规则同时会下行到硬件
		rules: [{
			sensorTypes: {type: String, enum: SENSOR_TYPES},
			thresholds: {type: Number, required: true}, //阀值,
			conditionType: {type: String, enum: ['gt', 'gte', 'lt', 'lte']},
			consecutivePeriods: {type: Number}, // 连续周期数
			period_start_hhmm: {type: String}, //生效开始
			period_end_hhmm: {type: String}, //生效介绍
		}],
		battery: [{
			thresholds: {type: Number},
			conditionType: {type: String, enum: ['gt', 'gte', 'lt', 'lte']},
			sensorTypes: String
		}],
		notification: {//单独的报警联系人, 如果未设置则使用账户所属的报警联系人
			content: {type: String},
			types: {type: String, enum: ['email', 'phone'], default: 'phone'},
		},
		createTime: {type: Date, default: Date.now}
	},
	status: {type: Number, enum: [0, 1, 2, 3], default: 3}, // 用于前端展示的状态值， 0 报警，1 正常，2 失联，3 未激活
	alarmStatus: {type: Number, enum: [1, 2], default: 1}, // 当前数据是否达到用户设定的报警状态 1 正常, 2, 报警
	alarmsRecords: [{ //一个报警设置下可能有多个规则，只有所有规则都未报警，alarmStatus 才会为 1
		sensorTypes: String,
		alarmStatus: Number
	}],
	remark: String,     //设备备注
	createTime: {type: Date, default: Date.now},
	lastUpdatedTime: Date,
	updatedTime: Date
}

// "127.0.0.1:3000/users?a=&b=&c=&d=20"
