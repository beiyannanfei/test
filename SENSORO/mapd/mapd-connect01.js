/**
 * Created by wyq on 17/8/24.
 */
const MapdCon = require("./node-connector.js");

const con = new MapdCon()
	.protocol("http")
	.host("139.199.212.13")
	.port('9090')
	.dbName('mapd')
	.user('mapd')
	.password('HyperInteractive')
	.connect((err, session) => {
		if (!!err) {
			return console.log("connect err: %j", err.message || err);
		}
		getTabels(session);
		query(session);
	});

function getTabels(sess) {
	sess.getTables((err, data) => {
		if (!!err) {
			return console.log("getTabels err: %j", err.message || err);
		}
		console.log("%j", data);    //[{"name":"flights_2008_10k","label":"obs"}]
	});
}

function query(sess) {
	let sqlStr = 'SELECT origin_city AS "Origin", dest_city AS "Destination", AVG(airtime) AS	"Average Airtime" FROM flights_2008_10k WHERE distance < 175 GROUP BY origin_city, dest_city;';
	sqlStr = "select * from flights_2008_10k WHERE distance < 175";
	sess.query(sqlStr, {}, (err, data)=> {
		if (!!err) {
			return console.log("query err: %j", err.message || err);
		}
		console.log("%j", data);
	});
}

