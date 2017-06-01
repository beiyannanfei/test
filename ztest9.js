function transGps(data) {
	let degree = ~~(data / 100);
	let min = ~~(data - degree * 100);
	let sec = (data - (~~data)) * 60;
	let result = degree + min / 60 + sec / 3600;
	return result;
}
const EARTH_RADIUS = 6378137.0;    //地球半径(单位M)
const PI = Math.PI;
function getFlatternDistance(lon1, lat1, lon2, lat2) {
	let getRad = function (d) {
		return d * PI / 180.0;
	};
	let f = getRad((lat1 + lat2) / 2);
	let g = getRad((lat1 - lat2) / 2);
	let l = getRad((lon1 - lon2) / 2);

	let sg = Math.sin(g);
	let sl = Math.sin(l);
	let sf = Math.sin(f);

	let s, c, w, r, d, h1, h2;
	let a = EARTH_RADIUS;
	let fl = 1 / 298.257;

	sg = sg * sg;
	sl = sl * sl;
	sf = sf * sf;

	s = sg * (1 - sl) + (1 - sf) * sl;
	c = (1 - sg) * (1 - sl) + sf * sl;

	w = Math.atan(Math.sqrt(s / c));
	r = Math.sqrt(s * c) / w;
	d = 2 * w * a;
	h1 = (3 * r - 1) / 2 / c;
	h2 = (3 * r + 1) / 2 / s;

	let distance = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
	return distance
}

let center = {lon: 116, lat: 39};

let a0 = {lon: 117, lat: 39};let a1 = {lon: 118, lat: 39};let a2 = {lon: 119, lat: 39};let a3 = {lon: 120, lat: 39};

let b0 = {lon: 117, lat: 40};let b1 = {lon: 118, lat: 41};let b2 = {lon: 119, lat: 42};let b3 = {lon: 120, lat: 43};

let c0 = {lon: 116, lat: 40};let c1 = {lon: 116, lat: 41};let c2 = {lon: 116, lat: 42};let c3 = {lon: 116, lat: 43};

console.log("center -> b0: ", getFlatternDistance(center.lon, center.lat, b0.lon, b0.lat));
console.log("b0 -> b1: ", getFlatternDistance(b0.lon, b0.lat, b1.lon, b1.lat));
console.log("b1 -> b2: ", getFlatternDistance(b1.lon, b1.lat, b2.lon, b2.lat));
console.log("b2 -> b3: ", getFlatternDistance(b2.lon, b2.lat, b3.lon, b3.lat));
console.log("=======================");
console.log("center -> c0: ", getFlatternDistance(center.lon, center.lat, c0.lon, c0.lat));
console.log("c0 -> c1: ", getFlatternDistance(c0.lon, c0.lat, c1.lon, c1.lat));
console.log("c1 -> c2: ", getFlatternDistance(c1.lon, c1.lat, c2.lon, c2.lat));
console.log("c2 -> c3: ", getFlatternDistance(c2.lon, c2.lat, c3.lon, c3.lat));
console.log("=======================");
console.log("center -> a0: ", getFlatternDistance(center.lon, center.lat, a0.lon, a0.lat));
console.log("a0 -> a1: ", getFlatternDistance(a0.lon, a0.lat, a1.lon, a1.lat));
console.log("a1 -> a2: ", getFlatternDistance(a1.lon, a1.lat, a2.lon, a2.lat));
console.log("a2 -> a3: ", getFlatternDistance(a2.lon, a2.lat, a3.lon, a3.lat));



