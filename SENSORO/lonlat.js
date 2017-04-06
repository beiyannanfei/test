/**
 * Created by wyq on 17/4/1.
 * 计算地球上两个点得距离
 */


var EARTH_RADIUS = 6378137.0;    //单位M
var PI = Math.PI;

function getRad(d) {
	return d * PI / 180.0;
}

/**
 * caculate the great circle distance
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */
function getGreatCircleDistance(lat1, lng1, lat2, lng2) {
	var radLat1 = getRad(lat1);
	var radLat2 = getRad(lat2);

	var a = radLat1 - radLat2;
	var b = getRad(lng1) - getRad(lng2);

	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	s = s * EARTH_RADIUS;
	s = Math.round(s * 10000) / 10000.0;
	return s;
}

function getFlatternDistance(lat1, lng1, lat2, lng2) {
	console.time("time: ");
	var f = getRad((lat1 + lat2) / 2);
	var g = getRad((lat1 - lat2) / 2);
	var l = getRad((lng1 - lng2) / 2);

	var sg = Math.sin(g);
	var sl = Math.sin(l);
	var sf = Math.sin(f);

	var s, c, w, r, d, h1, h2;
	var a = EARTH_RADIUS;
	var fl = 1 / 298.257;

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

	var res = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
	console.timeEnd("time: ");
	return res
}

/*var a = { //嫣然天使
 lon: 116.4837353070,
 lat: 39.9968540255
 };
 var b = { //北2门
 lon: 116.4828143070,
 lat: 39.9968500255
 };*/

/*var a = {
 lon: 116.4837353070,
 lat: 39.9968540255
 };
 var b = {
 lon: 116.4816463070,
 lat: 39.9971060255
 };*/

var a = {
	lon: 116.483735,
	lat: 39.996854
};
var b = {
	lon: 116.481646,
	lat: 39.997106
};

console.log(getGreatCircleDistance(a.lat, a.lon, b.lat, b.lon));
console.log(getFlatternDistance(a.lat, a.lon, b.lat, b.lon));

