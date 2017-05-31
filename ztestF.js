let customerData = "6301";

let BATTERY = customerData.slice(0, 2);
console.log(BATTERY);
BATTERY = parseInt(BATTERY, 16);
console.log(BATTERY);
let jinggai = customerData.slice(2);
console.log(jinggai);