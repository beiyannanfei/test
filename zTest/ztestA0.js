require('../env.js');
const co = require("co");

let condition = [
	{
		$match: {
			updatedTime: {
				$gte: new Date(2017, 10, 15, 9, 0, 0),
				$lte: new Date(2017, 10, 15, 10, 0, 0)
			}
		}
	},
	{
		$group: {
			_id: "$sn",
			count: {$sum: 1}
		},
	}
];

Log.aggregate(condition, function (err, response) {
	console.log("response = %j;", response);
});
