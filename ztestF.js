var a = [
	{
		a: 10,
		b: 20
	},
	{
		$group: {
			_id: {
				year: {$year: '$updatedTime'},
				month: {$month: '$updatedTime'},
				day: {$dayOfMonth: "$updatedTime"},
				hour: {$hour: "$updatedTime"}
			},
			count: {$sum: 1}
		}
	}
];

delete a[1].$group._id.hour;
console.log("%j", a);