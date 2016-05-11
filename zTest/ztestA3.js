var moment = require('moment');

var todayStr = moment(new Date()).format("YYYY-MM-DD");
var endDate = new Date(todayStr);
var startDate = new Date(endDate.getTime() - 24 * 3600 * 1000);

console.log(endDate.toLocaleString());
console.log(startDate.toLocaleString());