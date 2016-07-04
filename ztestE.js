var list = [
	{num: 50},
	{num: 20},
	{num: 30},
	{num: 80},
	{num: 25}
];

list.sort(function (a, b) {
	return a.num > b.num ? -1 : 1;
});

console.log(list);