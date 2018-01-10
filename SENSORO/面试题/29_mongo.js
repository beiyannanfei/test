/**
 * Created by wyq on 18/1/10.
 */
db.getCollection('test').aggregate(
	[
		{
			$unwind: "$friends"
		},
		{
			$match: {
				"friends.age": {$gte: 25, $lte: 38}
			}
		},
		{
			$project:
				{
					'friends.name': 1
				}
		}
	]
);