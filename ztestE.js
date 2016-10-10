var a = [
	{status: 1},
	{status: 2},
	{status: 3},
	{status: 4}
];

var b = a.map(item => {
	if (item.status == 2) {
		return item.status;
	}
});

console.log(b);