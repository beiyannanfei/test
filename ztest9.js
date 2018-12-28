t1Model.aggregate([
	{
		$project: {
			dataMonth: "把日期从这里进行转换成年月的格式，则每个文档中就会多出一个 dataMonth 字段"
		}
	},
	{
		$group: {
			_id: {
				data: "$dataMonth", //这个字段就是上边$project中构造出来的
				reason: "$gameId",
			},
			sum: {$sum: "$amount"}
		},
	}
], function (err, results) {
	if (!!err) {
		return console.log("err: %j", err.message || err);
	}
	console.log("results: %j", results);
	return process.exit(0);
});