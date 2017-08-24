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
	.connect((err, success) => console.log(success));


