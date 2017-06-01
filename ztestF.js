var schema = module.exports = new mongoose.Schema({
	sn: { type: String, unique: true },
	appId: { type: String },
	owners: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 被分配到的账号
	name: { type: String },
	calibration: Number,
	sensorTypes: { type: Array, default: [] }, //设备包含的传感器类型
	deviceType: { type: String, enum: DEVICE_TYPES, default: 'module' },
	sensorData: {
		battery: Number,
		interval: Number, //传输周期, 单位S, 自定义数据中会有此字段
		temperature: Number, // 温度
		humidity: Number, // 湿度
		water: Number, //水位传感器
		jinggai: Boolean, //井盖传感器 ,false 打开, true 闭合
		drop: { type: Number, enum: [0, 1] }, //滴漏传感器
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
		smoke: Boolean,
		customer:String //自定义数据
	},
	tags: { type: Array },
	indexTags: [String],
	lonlat: { type: [Number], index: '2d', default: [0, 0] },
	interval: Number, //传输周期, 单位S
	alarms: { //绑定的报警规则, 报警规则同时会下行到硬件
		rules: [{
			sensorTypes: { type: String, enum: SENSOR_TYPES },
			thresholds: { type: Number, required: true }, //阀值,
			conditionType: {type: String, enum: ['gt', 'gte', 'lt', 'lte' ]},
			consecutivePeriods: { type: Number }, // 连续周期数
			period_start_hhmm: { type: String }, //生效开始
			period_end_hhmm: { type: String }, //生效介绍
		}],
		notification: {//单独的报警联系人, 如果未设置则使用账户所属的报警联系人
			content: { type: String },
			types: { type: String, enum: ['email', 'phone'], default: 'phone' },
		},
		createTime: { type: Date,  default: Date.now }
	},
	status: { type: Number, enum: [0, 1, 2, 3], default: 3 }, // 用于前端展示的状态值， 0 报警，1 正常，2 失联，3 未激活
	alarmStatus: { type: Number, enum: [1, 2], default: 1 }, // 当前数据是否达到用户设定的报警状态 1 正常, 2, 报警
	alarmsRecords: [{ //一个报警设置下可能有多个规则，只有所有规则都未报警，alarmStatus 才会为 1
		sensorTypes: String,
		alarmStatus: Number
	}],
	createTime: { type: Date, default: Date.now },
	lastUpdatedTime: Date,
	updatedTime: Date
});