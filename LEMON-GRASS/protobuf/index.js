const ProtoBuf = require('protobufjs');
const LOGIN_PROTO = ProtoBuf.loadProtoFile(__dirname + '/login.proto').build();
const LOGIN = LOGIN_PROTO.Login;
const Request = LOGIN_PROTO.Request;

exports.requestEncoder = function (object) {
	let HEX_STRING = '';
	try {
		HEX_STRING = Request.encode(object);
	} catch (e) {
		if (e) {
			return HEX_STRING;
		}
	}

	if (HEX_STRING) {
		HEX_STRING = HEX_STRING.toString('hex');
	}

	return HEX_STRING;
};

exports.loginEncoder = function (object) {
	let HEX_STRING = '';
	try {
		HEX_STRING = LOGIN.encode(object);
	} catch (e) {
		if (e) {
			return HEX_STRING;
		}
	}

	if (HEX_STRING) {
		HEX_STRING = HEX_STRING.toString('hex');
	}

	return HEX_STRING;
};

/**
 * protobuffer 解析
 * @param  {string} customerData [description]
 * @return {Object}              [description]
 */

exports.decoder = function (string) {
	var RESULTS = {};
	if (!(string instanceof Buffer)) {
		string = new Buffer(string, 'hex');
	}

	try {
		RESULTS = GAS_Device.decode(string);
	} catch (e) {
		return RESULTS;
	}

	return RESULTS;
};

exports.demoEncoder = function (object) {
	var HEX_STRING = '';
	try {
		HEX_STRING = DEMO_Device.encode(object);
	} catch (e) {
		if (e) {
			return HEX_STRING;
		}
	}

	if (HEX_STRING) {
		HEX_STRING = HEX_STRING.toString('hex');
	}

	return HEX_STRING;
}

exports.paramDecoder = function (string) {
	var RESULTS = {};
	if (!(string instanceof Buffer)) {
		string = new Buffer(string, 'hex');
	}

	try {
		RESULTS = DEMO_Param.decode(string);
	} catch (e) {
		return RESULTS;
	}

	return RESULTS;
};

exports.demoDecoder = function (string) {
	var RESULTS = {};
	if (!(string instanceof Buffer)) {
		string = new Buffer(string, 'hex');
	}

	try {
		RESULTS = DEMO_Device.decode(string);
	} catch (e) {
		return RESULTS;
	}

	return RESULTS;
};
