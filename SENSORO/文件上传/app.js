/**
 * Created by wyq on 17/7/3.
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require("morgan");
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

process.on('uncaughtException', function (err) {
	console.error('[Inside \'uncaughtException\' event]' + err.stack || err.message);
});

morgan.token("date", function () {
	return new Date();
});
app.use(morgan('[:date] - :method :url :status :response-time ms - :res[content-length]'));   //todo POST /test 200 76.091 ms - 14
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.set('port', 3000);
app.listen(app.get('port'), function () {
	console.log('Express server listening on port %d', app.get('port'));
});

app.get("/test", function (req, res) {
	res.status(200);
	return res.send("test post body");
});








