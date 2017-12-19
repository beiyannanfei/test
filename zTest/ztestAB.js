let response = [
	{"_id": "no2", "count": 1},
	{"_id": "ch4", "count": 94},
	{"_id": "humidity|temperature", "count": 460},
	{"_id": "cover|level", "count": 1},
	{"_id": "smoke", "count": 100},
	{"_id": "co", "count": 19},
	{"_id": "pm10|pm2_5", "count": 20},
	{"_id": null, "count": 15},
	{"_id": "co2", "count": 18},
	{"_id": "drop", "count": 21}
];

let cMap = {total: 0};
response.forEach(item => {
	if (!item._id) {
		return;
	}
	cMap.total += +item.count;
	cMap[item._id] = +item.count;
});
console.log(cMap)



