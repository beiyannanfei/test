var response = {
	"data": {"info": "Invalid signature"},
	"status": 400,
	"headers": {
		"server": "openresty/1.9.15.1",
		"date": "Mon, 19 Jun 2017 10:25:00 GMT",
		"content-type": "application/json; charset=utf-8",
		"content-length": "28",
		"connection": "keep-alive",
		"x-powered-by": "Sensoro",
		"access-control-allow-origin": "undefined",
		"access-control-allow-methods": "GET, POST, DELETE, PUT, PATCH, OPTIONS",
		"access-control-allow-headers": "Origin, X-Requested-With, X-Session-ID,Old-X-Session-ID,X-Cookie, X-Media-Type, Content-Type, Accept, Authorization, x-cookie",
		"access-control-allow-credentials": "true",
		"etag": "W/\"1c-9e7a5000\""
	},
	"res": {
		"status": 400,
		"statusCode": 400,
		"headers": {
			"server": "openresty/1.9.15.1",
			"date": "Mon, 19 Jun 2017 10:25:00 GMT",
			"content-type": "application/json; charset=utf-8",
			"content-length": "28",
			"connection": "keep-alive",
			"x-powered-by": "Sensoro",
			"access-control-allow-origin": "undefined",
			"access-control-allow-methods": "GET, POST, DELETE, PUT, PATCH, OPTIONS",
			"access-control-allow-headers": "Origin, X-Requested-With, X-Session-ID,Old-X-Session-ID,X-Cookie, X-Media-Type, Content-Type, Accept, Authorization, x-cookie",
			"access-control-allow-credentials": "true",
			"etag": "W/\"1c-9e7a5000\""
		},
		"size": 28,
		"aborted": false,
		"rt": 56,
		"keepAliveSocket": false,
		"data": {"info": "Invalid signature"},
		"requestUrls": ["https://iot-api.sensoro.com/developers/station/list"],
		"timing": null,
		"remoteAddress": "139.198.0.108",
		"remotePort": 443
	}
};

let {data, status}=response;
console.log(data, status);