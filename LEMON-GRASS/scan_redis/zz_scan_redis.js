/**
 * Created by wyq on 2018/6/26.
 */
const Redis = require("ioredis");
const bluebird = require("bluebird");

run().then(response => {
	console.log("run script response: %j", response);
	return setTimeout(process.exit, 1000, 0);
}).catch(err => {
	console.log("run err: %j", err.message || err);
	return setTimeout(process.exit, 1000, 0);
});


async function run() {  //修改redis的key为上个月或上周
	for (let i1 = 1; i1 < 255; ++i1) {
		for (let i2 = 1; i2 < 255; ++i2) {
			for (let i3 = 1; i3 < 255; ++i3) {
				for (let i4 = 1; i4 < 255; ++i4) {
					let ip = `${i1}.${i2}.${i3}.${i4}`;
					console.log(ip);
				}
			}
		}
	}

	// let a = await connectRedis();
	// console.log(a);

	return "===================== SUCCESS =====================";
}

async function connectRedis(host, post) {
	return new Promise((resole, reject) => {
		let options = {};
		options.host = "103.253.73.157";
		options.port = 5002;
		options.db = 0;
		let rc = new Redis(options);

		setTimeout(reject, 1000, "aaa");

		rc.ping(function (err, response) {
			// console.log(response);
			return resole(response);
		});
	});
}