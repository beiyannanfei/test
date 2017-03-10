/**
 * Created by wyq on 17/3/9.
 * 另一个excel解析
 */
var xlsx = require("xlsx");
var fs = require("fs");
try {
	var buffer = fs.readFileSync("./excel1.xlsx");
} catch (e) {
	console.log("e: %s", e.message);
}
console.log(buffer);

try {
	var wb = xlsx.read(buffer, {type: "buffer"});
}
catch (e) {
	console.log("read error: %j", e.message || e);
}

console.log(wb.SheetNames);
var target_sheet = wb.SheetNames[0];
var ws = wb.Sheets[target_sheet];
console.log(ws);
var data = xlsx.utils.sheet_to_json(ws, {raw: true});
console.log("==============");
console.log(data);