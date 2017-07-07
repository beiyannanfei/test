let vals = [
	{distance: 12.34},
	{distance: 5.36},
	{distance: 20.59},
	{distance: 3.259},
	{distance: 11.254}
];

vals = vals.map(item => {
	item._distance = item.distance;
	return item;
}).sort((a, b)=> {
	return a._distance - b._distance;
});

console.log("%j", vals);