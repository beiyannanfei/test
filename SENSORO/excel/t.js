/**
 * Created by wyq on 18/1/28.
 */
const xlsx = require("node-xlsx");
const fs = require("fs");

let buffer = fs.readFileSync("/Users/sensoro/bynf/test/SENSORO/excel/lonlat.xlsx");
let result = JSON.parse(JSON.stringify(xlsx.parse(buffer)));
let t = result[0].data;
console.log(JSON.stringify(t), t.length);