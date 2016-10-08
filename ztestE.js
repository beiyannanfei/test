var count = 0;
for (var i = 1; i <= 96; ++i) {
	var temp = i * (i + 1) * (i + 2);
	if (temp % 8 == 0) {
		++count;
	}
}
console.log(count / 96);