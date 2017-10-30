let arr = [45, 87, 63, 45, 12, 87, 63];
let notSame = "";
for (let i of arr) {
	notSame ^= i;
	console.log("======= i: %j, notSame: %j", i, notSame);
}
console.log(notSame);

