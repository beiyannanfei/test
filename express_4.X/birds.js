/**
 * Created by wyq on 2016/5/13.
 */
var express = require('express');
var router = express.Router();
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);

// middleware specific to this router
router.use(function timeLog(req, res, next) {
	logger.info('\nTime: %j\nRequest Type: %j\nRequest URL: %j\nIP: %j\n', new Date().toLocaleString(), req.method, req.originalUrl, req.ip);
	next();
});
// define the home page route       curl "127.0.0.1:9002/birds"
router.get('/', function (req, res) {
	res.send('Birds home page');
});
// define the about route       curl "127.0.0.1:9002/birds/about"
router.get('/about', function (req, res) {
	res.send('About birds');
});

module.exports = router;