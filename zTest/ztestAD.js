var a = [
	{num: 55},
	{num: 100},
	{num: 25},
	{num: 59},
	{num: -10},
	{num: 54}
];

console.log(a);

a.sort(function (n1, n2) {
	return n2.num - n1.num;
});

console.log(a);

a.reverse();

console.log(a);