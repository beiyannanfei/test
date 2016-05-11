/**
 * Created by wyq on 2015/8/4.
 */
var _ = require("underscore");

var config = {
    "log4jsconfig": {
        "appenders": [
            {
                "type": "dateFile",
                "absolute": true,
                "filename": "./opt/logs/tmall.log",
                "pattern": "-yyyy-MM-dd"
            },
            {
                "type": "dateFile",
                "absolute": true,
                "filename": "./opt/logs/access.log",
                "pattern": "-yyyy-MM-dd",
                "category": "Express"
            },
            {
                "type": "console"
            }
        ],
        "levels": {
            "logger": "trace"
        },
        replaceConsole: true
    }
};

var log4js = require('log4js');
log4js.configure(config.log4jsconfig, {});
var logger = log4js.getLogger(__filename);

logger.trace("aaaaa");
logger.debug("aaaaa");
logger.info("aaaaa");
logger.warn("aaaaa");
logger.error("aaaaa");
logger.fatal("aaaaa");

logger.info("begin: %j", new Date().getTime());
console.time("a");
var a = [];
for (var index = 0; index < 1000000; ++index) {
    a.push(index);
}
for (var index = 0; index < 100; ++index) {
    a = _.shuffle(a);
}

console.timeEnd("a");
logger.info("end: %j", new Date().getTime());