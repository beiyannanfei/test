function saveOrder(cb) {
	setTimeout(function () {
		console.log("[%j]========= saveOrder", new Date().toLocaleString());
		return cb();
	}, 5000);
}

var start = function () {
	var a = 1;
	if (a) {
		return saveOrder(function () {
			setTimeout(start, 1000);
		});
	}
	console.log("========== else ==========")
};

start();