app.param('snList', function(req, res, next, snList) {
	var sns = snList.split(',').map(function(str) {
		return str.trim();
	}).filter(function(str) { // 过滤空字符串
		return str;
	});

	req.SNS = sns;
	Device.find({
		sn: {
			$in: sns
		}
	}, function(err, devices) {
		req.devices = devices;

		if (devices.length !== sns.length) {
			var _sns = _.pluck(devices, 'sn');
			req.UNEXIST_SNS = _.difference(sns, _sns);
		}

		next();
	});
});