function multiDevicesValidator(user, req, res, next) {
	if (!user) return res.status(401).json({
		errcode: 4010002,
		message: 'No permission.'
	});
	if (!req.devices.length) {
		return res.status(400).json({
			errcode: 4010101,
			errmsg: 'Devices not found'
		});
	}

	if (req.UNEXIST_SNS && req.UNEXIST_SNS.length) {
		return res.status(400).json({
			errcode: 4010101,
			errmsg: 'Devices not all found',
			UnexistDevices: req.UNEXIST_SNS
		});
	}

	var APPIDS = _.uniq(_.pluck(req.devices, 'appId'));
	if (APPIDS.length > 1) {
		return res.status(400).json({
			errcode: 4010108,
			errmsg: 'Cant operate multi appId devices.'
		});
	}

	req.NO_PERMISSION_SNS = [];
	req.devices = req.devices.filter(function (item) {
		if (!user.canManageDevice(item)) {
			req.SNS = _.without(req.SNS, item.sn);
			req.NO_PERMISSION_SNS.push(item.sn);
			return false;
		}

		return item;
	});

	return next();
}

var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var b = a.filter(item => {
	if (item % 2) {
		return false;
	}
	return item;
});

var _ = require("underscore");
a = [
	{a: 10, b: 1}, {a: 20, b: 2}, {a: 30, b: 3}, {a: 40, b: 2}
];

b = _.find(a, e => e.b == 20);
console.log(b);