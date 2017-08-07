let a = [1, 1, "1", 2, 2, "2", 3, 3, "3"];

let b = Array.from(new Set(a));
console.log(b);

let obj = {};
for (let i = 0; i < a.length; ++i) {
	let key = `${a[i]},${typeof a[i]}`;
	obj[key] = 1;
}
console.log(Object.keys(obj));

