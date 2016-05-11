var list = [];

var test = function (num) {
	var show = function () {
		setTimeout(function () {
			var value = list[0];
			list.splice(0, 1);
			console.log("============= " + value);
			if (list.length > 0) {
				process.nextTick(function(){
					console.log("nextTick 延迟执行");
					show();
				});
			}
		}, 10);
	};
	list.push(num);
	if (list.length == 1) {
		console.log("list: %j", list);
		show();
	}
};

for (var i = 0; i < 100; ++i) {
	test(i);
}