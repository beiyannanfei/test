/**
 * Created by wyq on 16/9/12.
 */
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require("morgan");
var mApi = require("./routes/api.js");
process.on('uncaughtException', err => {
	console.error('[Inside \'uncaughtException\' event]' + err.stack || err.message);
});

morgan.token("date", () => {
	return new Date();
});
app.use(morgan('[:date] - :method :url :status :response-time ms - :res[content-length]'));   //todo POST /test 200 76.091 ms - 14

app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	if (req.method == "OPTIONS") {
		return res.send(200);
	}
	next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/ajax", mApi);


app.use(express.static(path.join(__dirname, 'public')));

app.set('port', 9001);

app.listen(app.get('port'), function () {
	console.log('Express server listening on port %j', app.get('port'));
});


