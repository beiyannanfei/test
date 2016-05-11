var cursor = db.prize.find({"monitor": {$exists: 1, $ne: []}, "_id": ObjectId("56616f0a1f2309702000002a")})
var type = {"1": "index", "2": "open", "3": "get"}
while (cursor.hasNext()) {
	var nc = cursor.next();
	var v_cid = nc._id;
	var v_rename = {};
	var v_set = {};
	for (item in nc.monitor) {
		print("item=" + item + "   " + nc.monitor[item])
		if (!isNaN(item)) {
			v_rename['monitor.' + item] = 'monitor.' + type[item];
			v_set['monitor.' + type[item]] = {"data": nc.monitor[item], "type": "url"};
		}
	}
	print(JSON.stringify(v_rename));
	print(JSON.stringify(v_set));
	db.prize.update({_id: v_cid}, {$rename: v_rename});
	db.prize.update({_id: v_cid}, {$set: v_set});
}

var total = 0;
while (datas.hasNext()) {
	var order = datas.next();
	var total_fee = +(order ? (order.payResult ? order.payResult.total_fee : 0) : 0);
	total += total_fee;
}
print(total);
