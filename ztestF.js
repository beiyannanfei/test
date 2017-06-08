let a1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let a2 = [2, 4, 6, 8];

let a3 = a1.filter(item => !a2.includes(item));
console.log(a3);
console.log(a1);