let condition = [
	{
		$group: {
			_id: {
				year: {
					$year: "$updatedTime"
				},
				month: {
					$month: "$updatedTime"
				},
				day: {
					$dayOfMonth: "$updatedTime"
				},
				hour: {
					$hour: "$updatedTime"
				},
			},
			count: {
				$sum: 1
			}
		}
	}
];