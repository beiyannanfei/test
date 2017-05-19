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

let gpsa = {latitude: 3959.6717, longitude: 11628.5075, lat: 39.994528333333335, lon: 116.47512499999999};
let gpsb = {latitude: 3959.7717, longitude: 11628.6075, lat: 39.996195, lon: 116.47679166666667};
let gpsc = {latitude: 3959.8717, longitude: 11628.7075, lat: 39.99786166666667, lon: 116.47845833333334};
let gpsd = {latitude: 3959.9717, longitude: 11628.8075, lat: 39.99952833333334, lon: 116.48012500000002};
// console.log(transGps(gpsd.longitude));
// a->b=233.46  a->c=466.92  b->c=233.46 a->d=700.38 c->d=233.45 b->d=466
// console.log(getFlatternDistance(gpsb.lon, gpsb.lat, gpsd.lon, gpsd.lat));

// "longitude" : 11628.5471,
// 	"latitude" : 3959.6335

// 11628.5726,
// 	"latitude" : 3959.6192

console.log(transGps(11628.5726));
console.log(transGps(3959.6192));
