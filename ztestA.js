var _ = require("underscore");

let a = ['chip', 'co', 'co2', 'no2', 'so2', 'o3', 'ch4', 'tvoc', 'pm', 'lpg', 'leak', 'cover', 'temp_humi', 'smoke', 'angle', 'node', 'module', 'op_node'];

let b = ['chip', 'co', 'co2', 'no2', 'so2', 'o3', 'ch4', 'tvoc', 'pm', 'demo', 'lpg', 'cover', 'temp_humi', 'leak', 'smoke', 'angle', 'node', 'module'];

let
	c = a.concat(b);
let d = _.uniq(c);
console.log("%j", d);


